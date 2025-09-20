import json
import uuid
import time
import boto3
import os
import re
import statistics
import logging
import io
from collections import Counter
from urllib.parse import unquote_plus

# PDF and DOCX processing libraries
from pdfminer.high_level import extract_text as pdf_extract_text
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from docx import Document

# Configure logging for CloudWatch
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# --- Config ---
US_REGION = "us-east-1"
BEDROCK_REGION = os.environ.get("BEDROCK_REGION", US_REGION)
TABLE_NAME = os.environ.get("TABLE_NAME", "ContentDetections")
BUCKET_NAME = os.environ.get("BUCKET_NAME", "ai-detection-documents")

def get_clients():
    """Initialize AWS clients with forced region config."""
    # Use DATA_REGION for data services (S3, DynamoDB)
    data_region = os.environ.get("DATA_REGION", "ap-southeast-1")
    
    # Use BEDROCK_REGION for AI/ML services (Comprehend, Bedrock)
    ai_region = os.environ.get("BEDROCK_REGION", "us-east-1")
    
    s3 = boto3.client("s3", region_name=data_region)
    dynamodb = boto3.resource("dynamodb", region_name=data_region)
    comprehend = boto3.client("comprehend", region_name=ai_region)
    bedrock = boto3.client("bedrock-runtime", region_name=ai_region)

    # Debug log: confirm regions
    logger.info(f"S3 region: {s3.meta.region_name}")
    logger.info(f"DynamoDB region: {dynamodb.meta.client.meta.region_name}")
    logger.info(f"Comprehend region: {comprehend.meta.region_name}")
    logger.info(f"Bedrock region: {bedrock.meta.region_name}")

    return s3, dynamodb, comprehend, bedrock


def extract_text_from_pdf(file_stream):
    """Extract text from PDF using pdfminer.six."""
    try:
        # Method 1: Use high-level extract_text function
        text = pdf_extract_text(file_stream)
        
        if text and len(text.strip()) > 0:
            return text.strip()
        
        # Method 2: Fallback to lower-level extraction if high-level fails
        file_stream.seek(0)  # Reset stream position
        
        resource_manager = PDFResourceManager()
        fake_file_handle = io.StringIO()
        converter = TextConverter(resource_manager, fake_file_handle, laparams=LAParams())
        page_interpreter = PDFPageInterpreter(resource_manager, converter)
        
        for page in PDFPage.get_pages(file_stream, caching=True, check_extractable=True):
            page_interpreter.process_page(page)
        
        text = fake_file_handle.getvalue()
        converter.close()
        fake_file_handle.close()
        
        return text.strip()
        
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        raise


def extract_text_from_docx(file_stream):
    """Extract text from DOCX using python-docx."""
    try:
        # Load the document from the stream
        doc = Document(file_stream)
        
        # Extract text from all paragraphs
        full_text = []
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():  # Only add non-empty paragraphs
                full_text.append(paragraph.text)
        
        # Also extract text from tables if any
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    if cell.text.strip():
                        full_text.append(cell.text)
        
        extracted_text = '\n'.join(full_text)
        return extracted_text.strip()
        
    except Exception as e:
        logger.error(f"Error extracting text from DOCX: {str(e)}")
        raise


def extract_text_from_document(s3, bucket_name, object_key):
    """Extract text from document using local libraries instead of Textract."""
    try:
        logger.info(f"Starting text extraction for {bucket_name}/{object_key}")
        
        # Get file extension to determine processing method
        file_extension = object_key.lower().split('.')[-1]
        
        # Only support PDF and DOCX files
        if file_extension not in ['pdf', 'docx']:
            raise ValueError(f"Unsupported file type: {file_extension}. Only PDF and DOCX files are supported.")
        
        # Download file from S3 into memory
        obj = s3.get_object(Bucket=bucket_name, Key=object_key)
        file_content = obj['Body'].read()
        file_stream = io.BytesIO(file_content)
        
        extracted_text = ""
        extraction_method = ""
        
        if file_extension == 'pdf':
            extracted_text = extract_text_from_pdf(file_stream)
            extraction_method = "pdfminer"
            logger.info(f"Extracted {len(extracted_text)} characters from PDF using pdfminer")
            
        elif file_extension == 'docx':
            extracted_text = extract_text_from_docx(file_stream)
            extraction_method = "python-docx"
            logger.info(f"Extracted {len(extracted_text)} characters from DOCX using python-docx")
        
        if not extracted_text or len(extracted_text.strip()) < 10:
            raise ValueError(f"No readable text found in {file_extension.upper()} file or text too short")
        
        return extracted_text.strip(), extraction_method
        
    except Exception as e:
        logger.error(f"Error extracting text from document: {str(e)}")
        raise


def extract_from_mixed_response(raw_output):
    """Extract AI score and explanation from mixed text/JSON responses."""
    try:
        # Look for JSON-like patterns in the text
        json_pattern = r'\{[^{}]*"ai_score"[^{}]*\}'
        json_match = re.search(json_pattern, raw_output, re.IGNORECASE)
        
        if json_match:
            json_str = json_match.group()
            parsed = json.loads(json_str)
            score = int(float(parsed.get("ai_score", 50)))
            explanation = parsed.get("explanation", "Extracted from mixed response")
            return score, explanation
        
        # Look for score patterns like "ai_score: 85" or "Score: 75"
        score_patterns = [
            r'ai_score[:\s]+(\d+)',
            r'score[:\s]+(\d+)',
            r'likelihood[:\s]+(\d+)',
            r'(\d+)(?:/100|\s*%|\s*out\s+of\s+100)'
        ]
        
        for pattern in score_patterns:
            match = re.search(pattern, raw_output, re.IGNORECASE)
            if match:
                score = int(match.group(1))
                explanation = raw_output[:100].replace('\n', ' ').strip()
                return min(max(score, 0), 100), explanation
        
        # If no patterns found, analyze the text content for keywords
        text_lower = raw_output.lower()
        if any(word in text_lower for word in ['definitely ai', 'clearly ai', 'obviously ai']):
            return 85, "High confidence AI detection from text analysis"
        elif any(word in text_lower for word in ['likely ai', 'probably ai', 'suggests ai']):
            return 70, "Moderate confidence AI detection"
        elif any(word in text_lower for word in ['possibly human', 'likely human', 'human-like']):
            return 30, "Suggests human authorship"
        elif any(word in text_lower for word in ['definitely human', 'clearly human']):
            return 15, "High confidence human authorship"
        else:
            return 50, f"Unclear response: {raw_output[:50]}..."
            
    except Exception as e:
        return 50, f"Extraction error: {str(e)[:30]}"


def linguistic_analysis(text):
    """Perform linguistic analysis to detect AI patterns."""
    
    # AI-common phrases and patterns
    ai_phrases = [
        "exceeded expectations", "unparalleled", "state-of-the-art", "cutting-edge",
        "game-changer", "revolutionary", "innovative", "exceptional", "outstanding",
        "phenomenal", "impeccable", "seamless", "comprehensive", "meticulously",
        "pinnacle", "optimal", "robust", "sophisticated", "premier", "exemplary",
        "tour de force", "masterpiece", "extraordinary", "remarkable", "incredible",
        "amazing", "fantastic", "wonderful", "perfect", "flawless", "superior",
        "highly recommend", "without hesitation", "definitely", "absolutely",
        "experience that", "i am compelled", "it is worth noting", "furthermore",
        "in conclusion", "overall experience", "transformative", "paradigm shift"
    ]
    
    # Overly formal transitions
    formal_transitions = [
        "furthermore", "moreover", "additionally", "consequently", "therefore",
        "nevertheless", "nonetheless", "in conclusion", "to summarize",
        "it is worth noting", "it should be emphasized", "one must consider"
    ]
    
    # Calculate metrics
    text_lower = text.lower()
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    # 1. AI phrase density
    ai_phrase_count = sum(1 for phrase in ai_phrases if phrase in text_lower)
    ai_phrase_density = (ai_phrase_count / len(text.split())) * 100
    
    # 2. Formal transition usage
    formal_count = sum(1 for transition in formal_transitions if transition in text_lower)
    
    # 3. Sentence length consistency (AI tends to be more consistent)
    if len(sentences) > 1:
        sentence_lengths = [len(s.split()) for s in sentences]
        length_variance = statistics.variance(sentence_lengths) if len(sentence_lengths) > 1 else 0
        avg_sentence_length = statistics.mean(sentence_lengths)
    else:
        length_variance = 0
        avg_sentence_length = len(text.split())
    
    # 4. Punctuation patterns (AI rarely uses informal punctuation)
    exclamations = text.count('!')
    ellipses = text.count('...')
    informal_punct = exclamations + ellipses
    
    # 5. Word repetition patterns
    words = re.findall(r'\b\w+\b', text_lower)
    word_freq = Counter(words)
    repeated_words = sum(1 for count in word_freq.values() if count > 2)
    
    # 6. Generic vs specific language
    specific_indicators = ['$', '%', 'yesterday', 'today', 'last week', 'i bought', 'my friend', 'when i']
    specific_count = sum(1 for indicator in specific_indicators if indicator in text_lower)
    
    # Calculate AI likelihood score based on linguistic features
    ai_score = 0
    
    # High AI phrase density increases score
    if ai_phrase_density > 3:
        ai_score += 25
    elif ai_phrase_density > 1.5:
        ai_score += 15
    
    # Formal transitions increase score
    if formal_count > 2:
        ai_score += 20
    elif formal_count > 0:
        ai_score += 10
    
    # Low sentence length variance (too consistent) increases score
    if length_variance < 10 and len(sentences) > 2:
        ai_score += 15
    
    # Very long average sentences increase score
    if avg_sentence_length > 25:
        ai_score += 15
    
    # Lack of informal punctuation increases score
    if len(text) > 100 and informal_punct == 0:
        ai_score += 15
    
    # Low specific language usage increases score
    if specific_count == 0 and len(words) > 30:
        ai_score += 20
    
    # Perfect grammar (no typos or informal language) - rough heuristic
    if not re.search(r'\b(gonna|wanna|kinda|sorta|dunno|yeah|ok|lol)\b', text_lower):
        ai_score += 10
    
    return min(ai_score, 95), {
        "ai_phrase_density": round(ai_phrase_density, 2),
        "formal_transitions": formal_count,
        "sentence_variance": round(length_variance, 2),
        "avg_sentence_length": round(avg_sentence_length, 1),
        "informal_punctuation": informal_punct,
        "specific_indicators": specific_count
    }


def analyze_with_multiple_prompts(text, bedrock):
    """Use multiple AI detection prompts and ensemble the results."""
    
    prompts = [
        # Prompt 1: Direct detection with explicit JSON formatting
        {
            "instruction": (
                "Analyze this document text for AI generation. Look for: overly formal language, generic phrases, "
                "perfect grammar, lack of personal details, buzzwords, unnatural flow. "
                "IMPORTANT: Respond with ONLY this exact JSON format (no other text): "
                '{"ai_score": [number 0-100], "explanation": "[brief reason]"}'
            ),
            "weight": 0.4
        },
        # Prompt 2: Stylistic analysis with JSON enforcement
        {
            "instruction": (
                "Examine writing style in this document. Human writing has typos, casual language, personal anecdotes, "
                "varied sentences, imperfections. AI writing is polished and generic. "
                "Score 0-100 where 100=definitely AI. "
                'Respond ONLY with: {"ai_score": [number], "explanation": "[reason]"}'
            ),
            "weight": 0.3
        },
        # Prompt 3: Content authenticity with strict JSON
        {
            "instruction": (
                "Does this document content sound authentic? Look for specific details, emotions, complaints, personal stories, "
                "realistic language. Generic content without specifics suggests AI. "
                'Return ONLY valid JSON: {"ai_score": [0-100], "explanation": "[brief reason]"}'
            ),
            "weight": 0.3
        }
    ]
    
    scores = []
    explanations = []
    
    for prompt_data in prompts:
        try:
            user_content = f"{prompt_data['instruction']}\n\nDocument text to analyze:\n\n{text}"
            
            payload = {
                "messages": [
                    {
                        "role": "user", 
                        "content": [{"text": user_content}]
                    }
                ],
                "inferenceConfig": {
                    "maxTokens": 150,
                    "temperature": 0.0,
                    "stopSequences": ["\n\n", "Document text to analyze"]
                }
            }
            
            response = bedrock.invoke_model(
                modelId="amazon.nova-pro-v1:0",
                contentType="application/json",
                accept="application/json",
                body=json.dumps(payload)
            )
            
            model_payload = json.loads(response["body"].read())
            raw_output = ""
            
            # Parse Nova Pro response with better error handling
            if "output" in model_payload and "message" in model_payload["output"]:
                content = model_payload["output"]["message"].get("content", [])
                if content and isinstance(content, list) and len(content) > 0:
                    raw_output = content[0].get("text", "")
            else:
                logger.warning(f"Unexpected Nova response structure: {json.dumps(model_payload, indent=2)[:300]}")
                raw_output = str(model_payload)
            
            logger.info(f"Raw Nova output: {raw_output[:200]}")
            
            # Parse JSON response with robust handling
            try:
                # Clean the response - remove any markdown formatting
                cleaned_output = raw_output.strip()
                if cleaned_output.startswith('```json'):
                    cleaned_output = cleaned_output.replace('```json', '', 1).strip()
                if cleaned_output.endswith('```'):
                    cleaned_output = cleaned_output.rstrip('```').strip()
                
                # First, try direct JSON parsing
                parsed = json.loads(cleaned_output)
                score = int(float(parsed.get("ai_score", 50)))
                explanation = parsed.get("explanation", "")
                
                scores.append((score, prompt_data['weight']))
                explanations.append(explanation)
                logger.info(f"Successfully parsed JSON: score={score}")
                
            except json.JSONDecodeError as je:
                logger.warning(f"JSON parse failed: {str(je)}, attempting extraction from: {raw_output[:100]}")
                score, explanation = extract_from_mixed_response(raw_output)
                scores.append((score, prompt_data['weight']))
                explanations.append(explanation)
            except Exception as e:
                logger.error(f"General parse error: {str(e)}")
                scores.append((50, prompt_data['weight']))
                explanations.append(f"Error: {str(e)[:50]}")
                
        except Exception as e:
            logger.error(f"Bedrock API error: {str(e)}")
            scores.append((50, prompt_data['weight']))
            explanations.append(f"API Error: {str(e)[:50]}")
    
    # Calculate weighted average
    if scores:
        weighted_sum = sum(score * weight for score, weight in scores)
        total_weight = sum(weight for _, weight in scores)
        ensemble_score = int(weighted_sum / total_weight) if total_weight > 0 else 50
    else:
        ensemble_score = 50
    
    return ensemble_score, " | ".join(explanations[:2])


def analyze_text(text, comprehend, bedrock):
    """Enhanced analysis combining multiple detection methods."""
    
    # --- Comprehend analysis ---
    try:
        # Limit text length for Comprehend API
        text_for_comprehend = text[:5000] if len(text) > 5000 else text
        
        comp_result = comprehend.detect_sentiment(Text=text_for_comprehend, LanguageCode="en")
        sentiment = comp_result.get("Sentiment", "NEUTRAL")
        sentiment_scores = comp_result.get("SentimentScore", {})

        key_phrases_result = comprehend.detect_key_phrases(Text=text_for_comprehend, LanguageCode="en")
        key_phrases = [kp["Text"] for kp in key_phrases_result.get("KeyPhrases", [])]
    except Exception as e:
        logger.warning(f"Comprehend analysis failed: {str(e)}")
        sentiment = "UNKNOWN"
        sentiment_scores = {}
        key_phrases = []

    # --- Enhanced AI detection ---
    try:
        # 1. Linguistic pattern analysis
        linguistic_score, linguistic_features = linguistic_analysis(text)
        
        # 2. Multiple AI prompt ensemble (limit text for API)
        text_for_bedrock = text[:3000] if len(text) > 3000 else text
        ensemble_score, ensemble_explanation = analyze_with_multiple_prompts(text_for_bedrock, bedrock)
        
        # 3. Combine scores with weights
        # Linguistic analysis: 40%, AI ensemble: 60%
        final_score = int((linguistic_score * 0.4) + (ensemble_score * 0.6))
        
        # 4. Sentiment confidence adjustment
        # Very confident positive sentiment in reviews might indicate AI
        if sentiment == "POSITIVE":
            positive_confidence = sentiment_scores.get("Positive", 0)
            if positive_confidence > 0.95 and len(text) > 100:  # Suspiciously confident
                final_score = min(final_score + 10, 95)
        
        # 5. Document-specific adjustments
        # Very long documents with consistent tone might indicate AI
        if len(text) > 5000:
            word_count = len(text.split())
            sentences = re.split(r'[.!?]+', text)
            if word_count > 1000 and len(sentences) > 50:
                # Check for repetitive patterns in long documents
                final_score = min(final_score + 5, 95)
        
        # 6. Final explanation combining insights
        explanation = f"Ensemble: {ensemble_explanation} | Linguistic features: {linguistic_features}"
        
        # Cap the score to reasonable bounds
        final_score = max(5, min(final_score, 95))
        
    except Exception as e:
        logger.error(f"Enhanced analysis error: {str(e)}")
        final_score = 50
        explanation = f"Enhanced analysis error: {str(e)}"
        linguistic_features = {}

    return sentiment, key_phrases, final_score, explanation


def lambda_handler(event, context):
    """Lambda handler for document AI detection processing."""
    
    logger.info(f"Processing event: {json.dumps(event)}")
    
    try:
        # Parse input - can come from API Gateway or S3 event
        if event.get("Records"):
            # S3 event trigger
            record = event["Records"][0]
            bucket_name = record["s3"]["bucket"]["name"]
            object_key = unquote_plus(record["s3"]["object"]["key"])
            logger.info(f"Processing S3 event: {bucket_name}/{object_key}")
        else:
            # API Gateway event
            body = json.loads(event.get("body", "{}"))
            bucket_name = body.get("bucket_name", BUCKET_NAME)
            object_key = body.get("object_key", "")
            
            if not object_key:
                return {
                    "statusCode": 400, 
                    "body": json.dumps({"error": "No object_key provided"})
                }
        
        # Initialize AWS clients (no textract needed)
        s3, dynamodb, comprehend, bedrock = get_clients()
        table = dynamodb.Table(TABLE_NAME)
        
        # Extract text from document using local libraries
        extracted_text, extraction_method = extract_text_from_document(s3, bucket_name, object_key)
        
        if len(extracted_text) < 10:
            return {
                "statusCode": 400, 
                "body": json.dumps({"error": "Extracted text too short for meaningful analysis"})
            }
        
        # Analyze the extracted text
        sentiment, key_phrases, ai_score, explanation = analyze_text(extracted_text, comprehend, bedrock)
        
        # Get document metadata
        try:
            obj_metadata = s3.head_object(Bucket=bucket_name, Key=object_key)
            file_size = obj_metadata['ContentLength']
            last_modified = obj_metadata['LastModified'].isoformat()
        except Exception as e:
            logger.warning(f"Could not get object metadata: {str(e)}")
            file_size = 0
            last_modified = ""
        
        # Build enhanced item for DynamoDB
        item = {
            "id": str(uuid.uuid4()),
            "timestamp": str(int(time.time())),
            "bucket_name": bucket_name,
            "object_key": object_key,
            "file_size": file_size,
            "last_modified": last_modified,
            "extraction_method": extraction_method,
            "input_text": extracted_text[:1000],  # Store first 1000 chars
            "text_length": len(extracted_text),
            "ai_score": ai_score,
            "explanation": explanation[:500],  # Truncate long explanations
            "sentiment": sentiment,
            "key_phrases": key_phrases[:10],  # Limit key phrases
            "analysis_version": "document_v2",
            "source_type": "document"  # To distinguish from text analysis
        }
        
        # Store results in DynamoDB
        try:
            table.put_item(Item=item)
            logger.info(f"Successfully stored analysis results for {object_key}")
        except Exception as e:
            logger.error(f"Failed to write to DynamoDB: {str(e)}")
        
        # Return response
        response_body = {
            "document_id": item["id"],
            "object_key": object_key,
            "ai_score": ai_score,
            "explanation": explanation,
            "sentiment": sentiment,
            "key_phrases": key_phrases,
            "confidence": "high" if ai_score < 20 or ai_score > 80 else "medium",
            "text_length": len(extracted_text),
            "extraction_method": extraction_method
        }
        
        logger.info(f"Document analysis complete for {object_key}: AI score = {ai_score}")
        
        return {
            "statusCode": 200,
            "body": json.dumps(response_body),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }
        
    except Exception as e:
        logger.error(f"Lambda execution error: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": "Internal server error",
                "message": str(e)
            })
        }