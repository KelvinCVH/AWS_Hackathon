import json
import uuid
import time
import boto3
import os
import re
import statistics
from collections import Counter

# --- Config ---
DEFAULT_REGION = "us-east-1"
BEDROCK_REGION = os.environ.get("BEDROCK_REGION", DEFAULT_REGION)
TABLE_NAME = os.environ.get("TABLE_NAME", "ContentDetections")

def get_clients():
    """Initialize AWS clients with forced region config."""
    dynamodb = boto3.resource("dynamodb", region_name=os.environ.get("AWS_REGION", "ap-southeast-5"))
    comprehend = boto3.client("comprehend", region_name=BEDROCK_REGION)
    bedrock = boto3.client("bedrock-runtime", region_name=BEDROCK_REGION)

    # Debug log: confirm regions
    print(f"[DEBUG] DynamoDB region: {dynamodb.meta.client.meta.region_name}")
    print(f"[DEBUG] Comprehend region: {comprehend.meta.region_name}")
    print(f"[DEBUG] Bedrock region: {bedrock.meta.region_name}")

    return dynamodb, comprehend, bedrock


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
                # Extract explanation from surrounding text
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
                "Analyze this text for AI generation. Look for: overly formal language, generic phrases, "
                "perfect grammar, lack of personal details, buzzwords, unnatural flow. "
                "IMPORTANT: Respond with ONLY this exact JSON format (no other text): "
                '{"ai_score": [number 0-100], "explanation": "[brief reason]"}'
            ),
            "weight": 0.4
        },
        # Prompt 2: Stylistic analysis with JSON enforcement
        {
            "instruction": (
                "Examine writing style. Human writing has typos, casual language, personal anecdotes, "
                "varied sentences, imperfections. AI writing is polished and generic. "
                "Score 0-100 where 100=definitely AI. "
                'Respond ONLY with: {"ai_score": [number], "explanation": "[reason]"}'
            ),
            "weight": 0.3
        },
        # Prompt 3: Content authenticity with strict JSON
        {
            "instruction": (
                "Does this sound authentic? Look for specific details, emotions, complaints, personal stories, "
                "realistic language. Generic praise without specifics suggests AI. "
                'Return ONLY valid JSON: {"ai_score": [0-100], "explanation": "[brief reason]"}'
            ),
            "weight": 0.3
        }
    ]
    
    scores = []
    explanations = []
    
    for prompt_data in prompts:
        try:
            user_content = f"{prompt_data['instruction']}\n\nText to analyze:\n\n{text}"
            
            payload = {
                "messages": [
                    {
                        "role": "user", 
                        "content": [{"text": user_content}]
                    }
                ],
                "inferenceConfig": {
                    "maxTokens": 150,  # Reduced for more focused responses
                    "temperature": 0.0,  # Zero temperature for maximum consistency
                    "stopSequences": ["\n\n", "Text to analyze"]  # Stop if it starts repeating
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
                # Log unexpected response structure for debugging
                print(f"[DEBUG] Unexpected Nova response structure: {json.dumps(model_payload, indent=2)[:300]}")
                raw_output = str(model_payload)
            
            # Debug log the raw response
            print(f"[DEBUG] Raw Nova output: {raw_output[:200]}")
            
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
                print(f"[DEBUG] Successfully parsed JSON: score={score}")
                
            except json.JSONDecodeError as je:
                print(f"[DEBUG] JSON parse failed: {str(je)}, attempting extraction from: {raw_output[:100]}")
                # If JSON parsing fails, try to extract from mixed content
                score, explanation = extract_from_mixed_response(raw_output)
                scores.append((score, prompt_data['weight']))
                explanations.append(explanation)
            except Exception as e:
                print(f"[DEBUG] General parse error: {str(e)}")
                scores.append((50, prompt_data['weight']))
                explanations.append(f"Error: {str(e)[:50]}")
                
        except Exception as e:
            scores.append((50, prompt_data['weight']))
            explanations.append(f"API Error: {str(e)[:50]}")
    
    # Calculate weighted average
    if scores:
        weighted_sum = sum(score * weight for score, weight in scores)
        total_weight = sum(weight for _, weight in scores)
        ensemble_score = int(weighted_sum / total_weight) if total_weight > 0 else 50
    else:
        ensemble_score = 50
    
    return ensemble_score, " | ".join(explanations[:2])  # Combine top explanations


def analyze_text(text, comprehend, bedrock):
    """Enhanced analysis combining multiple detection methods."""
    
    # --- Comprehend analysis ---
    comp_result = comprehend.detect_sentiment(Text=text, LanguageCode="en")
    sentiment = comp_result.get("Sentiment", "NEUTRAL")
    sentiment_scores = comp_result.get("SentimentScore", {})

    key_phrases_result = comprehend.detect_key_phrases(Text=text, LanguageCode="en")
    key_phrases = [kp["Text"] for kp in key_phrases_result.get("KeyPhrases", [])]

    # --- Enhanced AI detection ---
    try:
        # 1. Linguistic pattern analysis
        linguistic_score, linguistic_features = linguistic_analysis(text)
        
        # 2. Multiple AI prompt ensemble
        ensemble_score, ensemble_explanation = analyze_with_multiple_prompts(text, bedrock)
        
        # 3. Combine scores with weights
        # Linguistic analysis: 40%, AI ensemble: 60%
        final_score = int((linguistic_score * 0.4) + (ensemble_score * 0.6))
        
        # 4. Sentiment confidence adjustment
        # Very confident positive sentiment in reviews might indicate AI
        if sentiment == "POSITIVE":
            positive_confidence = sentiment_scores.get("Positive", 0)
            if positive_confidence > 0.95 and len(text) > 100:  # Suspiciously confident
                final_score = min(final_score + 10, 95)
        
        # 5. Final explanation combining insights
        explanation = f"Ensemble: {ensemble_explanation} | Linguistic features: {linguistic_features}"
        
        # Cap the score to reasonable bounds
        final_score = max(5, min(final_score, 95))
        
    except Exception as e:
        final_score = 50
        explanation = f"Enhanced analysis error: {str(e)}"
        linguistic_features = {}

    return sentiment, key_phrases, final_score, explanation


def lambda_handler(event, context):
    # Parse input text from API Gateway event
    body = json.loads(event.get("body", "{}"))
    text = body.get("text", "")

    if not text:
        return {"statusCode": 400, "body": json.dumps({"error": "No text provided"})}

    if len(text) < 10:
        return {"statusCode": 400, "body": json.dumps({"error": "Text too short for meaningful analysis"})}

    dynamodb, comprehend, bedrock = get_clients()
    table = dynamodb.Table(TABLE_NAME)

    sentiment, key_phrases, ai_score, explanation = analyze_text(text, comprehend, bedrock)

    # Build enhanced item for DynamoDB
    item = {
        "id": str(uuid.uuid4()),
        "timestamp": str(int(time.time())),
        "input_text": text[:1000],  # Truncate very long texts for storage
        "ai_score": ai_score,
        "explanation": explanation[:500],  # Truncate long explanations
        "sentiment": sentiment,
        "key_phrases": key_phrases[:10],  # Limit key phrases
        "text_length": len(text),
        "analysis_version": "enhanced_v1"
    }
    
    try:
        table.put_item(Item=item)
    except Exception as e:
        print(f"[WARN] Failed to write to DynamoDB: {e}")

    # Return enhanced API Gateway response
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "ai_score": ai_score,
            "explanation": explanation,
            "sentiment": sentiment,
            "key_phrases": key_phrases,
            "confidence": "high" if ai_score < 20 or ai_score > 80 else "medium",
            "text_length": len(text)
        }),
    }