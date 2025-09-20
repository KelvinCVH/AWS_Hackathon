import json
import uuid
import time
import boto3
import os
import re
import statistics
import logging
import io
import math
from collections import Counter, defaultdict
from urllib.parse import unquote_plus
import numpy as np

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

def get_cors_headers():
    """Return standardized CORS headers"""
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Accept,Origin,Referer",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS,PUT,DELETE",
        "Access-Control-Max-Age": "86400",
        "Content-Type": "application/json"
    }

def handle_options_request():
    """Handle CORS preflight OPTIONS requests"""
    logger.info("Handling OPTIONS request for CORS preflight")
    return {
        "statusCode": 200,
        "headers": get_cors_headers(),
        "body": json.dumps({"message": "CORS preflight successful"})
    }

def get_clients():
    """Initialize AWS clients with forced region config."""
    data_region = os.environ.get("DATA_REGION", "ap-southeast-1")
    ai_region = os.environ.get("BEDROCK_REGION", "us-east-1")
    
    s3 = boto3.client("s3", region_name=data_region)
    dynamodb = boto3.resource("dynamodb", region_name=data_region)
    comprehend = boto3.client("comprehend", region_name=ai_region)
    bedrock = boto3.client("bedrock-runtime", region_name=ai_region)

    logger.info(f"S3 region: {s3.meta.region_name}")
    logger.info(f"DynamoDB region: {dynamodb.meta.client.meta.region_name}")
    logger.info(f"Comprehend region: {comprehend.meta.region_name}")
    logger.info(f"Bedrock region: {bedrock.meta.region_name}")

    return s3, dynamodb, comprehend, bedrock

def extract_text_from_pdf(file_stream):
    """Extract text from PDF using pdfminer.six."""
    try:
        text = pdf_extract_text(file_stream)
        
        if text and len(text.strip()) > 0:
            return text.strip()
        
        file_stream.seek(0)
        
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
        doc = Document(file_stream)
        
        full_text = []
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                full_text.append(paragraph.text)
        
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
    """Extract text from document using local libraries."""
    try:
        logger.info(f"Starting text extraction for {bucket_name}/{object_key}")
        
        file_extension = object_key.lower().split('.')[-1]
        
        if file_extension not in ['pdf', 'docx']:
            raise ValueError(f"Unsupported file type: {file_extension}. Only PDF and DOCX files are supported.")
        
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

def calculate_perplexity_and_burstiness(text):
    """
    Calculate perplexity and burstiness metrics.
    AI text tends to have lower perplexity and less burstiness.
    """
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    if len(sentences) < 2:
        return 50, 50  # Default neutral scores
    
    # Calculate sentence length variation (burstiness)
    sentence_lengths = [len(s.split()) for s in sentences]
    
    if len(sentence_lengths) > 1:
        mean_length = statistics.mean(sentence_lengths)
        std_length = statistics.stdev(sentence_lengths)
        cv = (std_length / mean_length * 100) if mean_length > 0 else 0  # Coefficient of variation
        
        # Human writing typically has CV between 40-80%
        # AI writing typically has CV between 20-40%
        if cv < 30:
            burstiness_score = 80  # Low variation suggests AI
        elif cv < 50:
            burstiness_score = 60
        elif cv < 70:
            burstiness_score = 40
        else:
            burstiness_score = 20  # High variation suggests human
    else:
        burstiness_score = 50
    
    # Calculate word variety (proxy for perplexity)
    words = re.findall(r'\b\w+\b', text.lower())
    unique_words = set(words)
    
    if len(words) > 0:
        lexical_diversity = len(unique_words) / len(words)
        
        # AI text often has higher lexical diversity (uses varied vocabulary)
        # Human text, especially casual, often repeats words more
        if lexical_diversity > 0.7:
            perplexity_score = 70  # High diversity suggests AI
        elif lexical_diversity > 0.5:
            perplexity_score = 50
        else:
            perplexity_score = 30  # Lower diversity suggests human
    else:
        perplexity_score = 50
    
    return perplexity_score, burstiness_score

def analyze_ngrams(text, n=3):
    """
    Analyze n-gram patterns to detect repetitive structures common in AI text.
    """
    words = re.findall(r'\b\w+\b', text.lower())
    
    if len(words) < n:
        return 50
    
    ngrams = []
    for i in range(len(words) - n + 1):
        ngrams.append(' '.join(words[i:i+n]))
    
    ngram_counts = Counter(ngrams)
    
    # Count repeated n-grams (appearing more than once)
    repeated_ngrams = sum(1 for count in ngram_counts.values() if count > 1)
    repetition_rate = repeated_ngrams / len(ngrams) if ngrams else 0
    
    # AI text often has more unique n-grams (less repetition)
    if repetition_rate < 0.05:
        return 70  # Very low repetition suggests AI
    elif repetition_rate < 0.15:
        return 50
    else:
        return 30  # Higher repetition suggests human

def detect_ai_artifacts(text):
    """
    Detect specific artifacts common in AI-generated text.
    """
    artifacts_score = 0
    
    # Check for markdown-like formatting in plain text (AI sometimes adds this)
    if re.search(r'\*\*[^*]+\*\*|\#\s+|\-\s+\[|\]\(http', text):
        artifacts_score += 15
    
    # Check for over-structured patterns (numbered lists in essays)
    if re.search(r'^\d+\.\s+', text, re.MULTILINE):
        list_count = len(re.findall(r'^\d+\.\s+', text, re.MULTILINE))
        if list_count > 3:
            artifacts_score += 20
    
    # Check for disclaimer-like phrases common in AI
    ai_disclaimers = [
        "it is important to note",
        "it should be noted",
        "it is worth mentioning",
        "as an ai",
        "i must emphasize",
        "please note that",
        "keep in mind that"
    ]
    
    disclaimer_count = sum(1 for phrase in ai_disclaimers if phrase in text.lower())
    artifacts_score += min(disclaimer_count * 10, 30)
    
    # Check for overly balanced arguments (AI tends to present both sides equally)
    balance_phrases = ["on the one hand", "on the other hand", "however", "conversely", "alternatively"]
    balance_count = sum(1 for phrase in balance_phrases if phrase in text.lower())
    if balance_count > 3:
        artifacts_score += 15
    
    return min(artifacts_score, 80)

def analyze_semantic_coherence(text):
    """
    Analyze semantic coherence and topic consistency.
    AI text tends to maintain very consistent topic focus.
    """
    paragraphs = text.split('\n\n')
    if len(paragraphs) < 2:
        paragraphs = text.split('\n')
    
    if len(paragraphs) < 2:
        return 50
    
    # Extract key terms from each paragraph
    paragraph_terms = []
    for para in paragraphs:
        words = re.findall(r'\b\w{4,}\b', para.lower())  # Words with 4+ chars
        paragraph_terms.append(set(words))
    
    # Calculate term overlap between consecutive paragraphs
    overlaps = []
    for i in range(len(paragraph_terms) - 1):
        if paragraph_terms[i] and paragraph_terms[i + 1]:
            intersection = paragraph_terms[i] & paragraph_terms[i + 1]
            union = paragraph_terms[i] | paragraph_terms[i + 1]
            overlap = len(intersection) / len(union) if union else 0
            overlaps.append(overlap)
    
    if overlaps:
        avg_overlap = statistics.mean(overlaps)
        
        # AI text tends to have higher semantic overlap (0.3-0.5)
        # Human text is more variable (0.1-0.3 typically)
        if avg_overlap > 0.4:
            return 70  # High overlap suggests AI
        elif avg_overlap > 0.25:
            return 50
        else:
            return 30  # Lower overlap suggests human
    
    return 50

def analyze_sentence_structure(text):
    """
    Analyze sentence structure patterns that distinguish AI from human writing.
    """
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 10]
    
    if len(sentences) < 3:
        return 50
    
    # Analyze sentence length patterns
    sentence_lengths = [len(s.split()) for s in sentences]
    avg_length = statistics.mean(sentence_lengths)
    length_std = statistics.stdev(sentence_lengths) if len(sentence_lengths) > 1 else 0
    
    # AI tends to have more consistent sentence lengths
    length_consistency = 1 - (length_std / avg_length) if avg_length > 0 else 0
    
    # Analyze sentence complexity (subordinate clauses, conjunctions)
    complex_sentences = 0
    for sentence in sentences:
        # Count subordinate clauses
        subordinate_clauses = len(re.findall(r'\b(that|which|who|whom|whose|where|when|why|how|if|unless|although|because|since|while|before|after)\b', sentence.lower()))
        # Count conjunctions
        conjunctions = len(re.findall(r'\b(and|but|or|so|yet|for|nor)\b', sentence.lower()))
        
        if subordinate_clauses > 2 or conjunctions > 3:
            complex_sentences += 1
    
    complexity_ratio = complex_sentences / len(sentences)
    
    # AI tends to have more consistent complexity
    if length_consistency > 0.8 and complexity_ratio > 0.6:
        return 70  # Very consistent, likely AI
    elif length_consistency > 0.6 and complexity_ratio > 0.4:
        return 60
    elif length_consistency < 0.4 and complexity_ratio < 0.3:
        return 30  # Variable, likely human
    else:
        return 50

def analyze_vocabulary_sophistication(text):
    """
    Analyze vocabulary sophistication and word choice patterns.
    """
    words = re.findall(r'\b\w+\b', text.lower())
    if len(words) < 10:
        return 50
    
    # Calculate lexical diversity
    unique_words = set(words)
    lexical_diversity = len(unique_words) / len(words)
    
    # Count sophisticated words (longer, less common)
    sophisticated_words = [w for w in words if len(w) > 8 and w not in ['therefore', 'however', 'moreover', 'furthermore']]
    sophistication_ratio = len(sophisticated_words) / len(words)
    
    # Count rare words (not in common word list)
    common_words = {'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their'}
    rare_words = [w for w in words if w not in common_words and len(w) > 3]
    rarity_ratio = len(rare_words) / len(words)
    
    # AI often uses more sophisticated vocabulary consistently
    if lexical_diversity > 0.8 and sophistication_ratio > 0.15:
        return 70  # Very sophisticated, likely AI
    elif lexical_diversity > 0.6 and sophistication_ratio > 0.1:
        return 60
    elif lexical_diversity < 0.5 and sophistication_ratio < 0.05:
        return 30  # Simple vocabulary, likely human
    else:
        return 50

def analyze_repetition_patterns(text):
    """
    Analyze repetition and redundancy patterns.
    """
    words = re.findall(r'\b\w+\b', text.lower())
    if len(words) < 20:
        return 50
    
    # Count word frequency
    word_counts = Counter(words)
    
    # Calculate repetition metrics
    total_words = len(words)
    unique_words = len(word_counts)
    
    # High-frequency words (appearing more than 3 times)
    high_freq_words = [word for word, count in word_counts.items() if count > 3]
    high_freq_ratio = len(high_freq_words) / unique_words if unique_words > 0 else 0
    
    # Phrase repetition (2-3 word phrases)
    phrases = []
    for i in range(len(words) - 1):
        phrase = ' '.join(words[i:i+2])
        phrases.append(phrase)
    
    phrase_counts = Counter(phrases)
    repeated_phrases = [phrase for phrase, count in phrase_counts.items() if count > 2]
    phrase_repetition_ratio = len(repeated_phrases) / len(set(phrases)) if phrases else 0
    
    # AI tends to have less repetition, more varied vocabulary
    if high_freq_ratio < 0.1 and phrase_repetition_ratio < 0.05:
        return 70  # Very varied, likely AI
    elif high_freq_ratio < 0.2 and phrase_repetition_ratio < 0.1:
        return 60
    elif high_freq_ratio > 0.3 and phrase_repetition_ratio > 0.2:
        return 30  # Repetitive, likely human
    else:
        return 50

def analyze_temporal_references(text):
    """
    Analyze temporal and spatial references that indicate human vs AI writing.
    """
    # Temporal references
    temporal_words = len(re.findall(r'\b(today|yesterday|tomorrow|now|recently|lately|soon|earlier|later|before|after|during|while|when|then|nowadays|currently|previously|subsequently)\b', text.lower()))
    
    # Specific time references
    specific_times = len(re.findall(r'\b\d{1,2}:\d{2}|\b(am|pm)\b|\b(morning|afternoon|evening|night)\b|\b(january|february|march|april|may|june|july|august|september|october|november|december)\b', text.lower()))
    
    # Spatial references
    spatial_words = len(re.findall(r'\b(here|there|where|location|place|room|building|street|city|country|home|office|school|hospital|restaurant|store|park|beach|mountain|river|lake|ocean)\b', text.lower()))
    
    # Personal experience indicators
    experience_words = len(re.findall(r'\b(remember|recall|experienced|happened|occurred|witnessed|saw|heard|felt|noticed|realized|discovered|learned|understood)\b', text.lower()))
    
    total_words = len(text.split())
    temporal_ratio = temporal_words / total_words if total_words > 0 else 0
    spatial_ratio = spatial_words / total_words if total_words > 0 else 0
    experience_ratio = experience_words / total_words if total_words > 0 else 0
    
    # Human writing tends to have more temporal and spatial references
    if temporal_ratio > 0.02 and spatial_ratio > 0.01 and experience_ratio > 0.01:
        return 30  # Many references, likely human
    elif temporal_ratio > 0.01 or spatial_ratio > 0.005:
        return 40
    elif temporal_ratio < 0.005 and spatial_ratio < 0.002:
        return 70  # Few references, likely AI
    else:
        return 50

def enhanced_linguistic_analysis(text):
    """
    Enhanced linguistic analysis with more sophisticated AI detection patterns.
    """
    score_components = []
    
    # 1. Perplexity and Burstiness (enhanced)
    perplexity_score, burstiness_score = calculate_perplexity_and_burstiness(text)
    score_components.append(("perplexity", perplexity_score, 0.12))
    score_components.append(("burstiness", burstiness_score, 0.12))
    
    # 2. Advanced N-gram analysis
    ngram_score = analyze_ngrams(text)
    score_components.append(("ngrams", ngram_score, 0.08))
    
    # 3. Enhanced AI artifacts detection
    artifacts_score = detect_ai_artifacts(text)
    score_components.append(("artifacts", artifacts_score, 0.15))
    
    # 4. Semantic coherence analysis
    coherence_score = analyze_semantic_coherence(text)
    score_components.append(("coherence", coherence_score, 0.08))
    
    # 5. Writing style consistency (enhanced)
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 10]
    
    if len(sentences) > 3:
        # Check for consistent sentence starters
        starters = [s.split()[0].lower() if s.split() else "" for s in sentences]
        starter_variety = len(set(starters)) / len(starters)
        
        if starter_variety < 0.3:  # Many sentences start the same way
            score_components.append(("starters", 70, 0.08))
        elif starter_variety < 0.5:
            score_components.append(("starters", 50, 0.08))
        else:
            score_components.append(("starters", 30, 0.08))
    else:
        score_components.append(("starters", 50, 0.08))
    
    # 6. Enhanced emotional and personal content analysis
    personal_pronouns = len(re.findall(r'\b(i|me|my|myself|we|us|our)\b', text.lower()))
    emotional_words = len(re.findall(r'\b(love|hate|angry|happy|sad|frustrated|excited|worried|scared|amazing|incredible|fantastic|terrible|awful)\b', text.lower()))
    
    word_count = len(text.split())
    personal_ratio = (personal_pronouns / word_count * 100) if word_count > 0 else 0
    emotional_ratio = (emotional_words / word_count * 100) if word_count > 0 else 0
    
    if personal_ratio < 0.5 and emotional_ratio < 0.2:
        score_components.append(("personal", 70, 0.08))  # Lack of personal touch suggests AI
    elif personal_ratio < 1.0 and emotional_ratio < 0.5:
        score_components.append(("personal", 50, 0.08))
    else:
        score_components.append(("personal", 30, 0.08))
    
    # 7. Citation and reference patterns (for academic documents)
    citation_patterns = len(re.findall(r'\(\d{4}\)|\[\d+\]|\b\d{4}\b', text))
    if citation_patterns > 5:
        # Academic document - adjust scoring
        score_components.append(("academic", 40, 0.08))  # Academic docs can be formal
    else:
        score_components.append(("academic", 50, 0.08))
    
    # 8. NEW: Advanced sentence structure analysis
    structure_score = analyze_sentence_structure(text)
    score_components.append(("structure", structure_score, 0.10))
    
    # 9. NEW: Vocabulary sophistication analysis
    vocab_score = analyze_vocabulary_sophistication(text)
    score_components.append(("vocabulary", vocab_score, 0.08))
    
    # 10. NEW: Repetition and redundancy analysis
    repetition_score = analyze_repetition_patterns(text)
    score_components.append(("repetition", repetition_score, 0.08))
    
    # 11. NEW: Temporal and spatial references
    temporal_score = analyze_temporal_references(text)
    score_components.append(("temporal", temporal_score, 0.05))
    
    # Calculate weighted score
    total_score = sum(score * weight for _, score, weight in score_components)
    
    # Create detailed features dictionary
    features = {
        comp[0]: comp[1] for comp in score_components
    }
    
    return int(total_score), features

def adaptive_prompt_ensemble(text, bedrock, document_context=None):
    """
    Use adaptive prompting based on document type and context.
    """
    
    # Determine document type
    is_academic = bool(re.search(r'abstract|introduction|conclusion|references|bibliography', text.lower()))
    has_citations = bool(re.search(r'\(\d{4}\)|\[\d+\]', text))
    is_creative = bool(re.search(r'chapter|story|once upon|character', text.lower()))
    
    # Select appropriate prompts based on context
    if is_academic or has_citations:
        prompts = [
            {
                "instruction": (
                    "Analyze this academic document for AI generation. Consider that academic writing is naturally formal. "
                    "Look for: unnatural perfection, lack of original thought, generic arguments without specific examples, "
                    "perfect citation formatting throughout, no personal insights or interpretations. "
                    "Human academic writing often has: minor inconsistencies, personal interpretations, specific case studies, "
                    "occasional informal notes, varied citation styles. "
                    'Score 0-100 where 100=definitely AI. Return ONLY: {"ai_score": [number], "explanation": "[reason]"}'
                ),
                "weight": 0.35
            },
            {
                "instruction": (
                    "Examine the argumentation style in this academic text. "
                    "AI tends to: present perfectly balanced arguments, use generic examples, lack deep critical analysis. "
                    "Human academics: show bias, use specific real-world examples, demonstrate deep domain knowledge. "
                    'Return ONLY valid JSON: {"ai_score": [0-100], "explanation": "[brief reason]"}'
                ),
                "weight": 0.35
            },
            {
                "instruction": (
                    "Assess the research depth and originality. "
                    "AI often: summarizes existing knowledge, lacks novel connections, uses safe interpretations. "
                    "Humans: propose original ideas, make unexpected connections, show research struggles. "
                    'Respond with ONLY: {"ai_score": [number 0-100], "explanation": "[reason]"}'
                ),
                "weight": 0.30
            }
        ]
    elif is_creative:
        prompts = [
            {
                "instruction": (
                    "Analyze this creative writing for AI patterns. "
                    "AI creative writing often has: predictable plot development, generic descriptions, consistent pacing. "
                    "Human creative writing has: unexpected turns, unique voice, varied pacing, personal quirks. "
                    'Return ONLY: {"ai_score": [0-100], "explanation": "[reason]"}'
                ),
                "weight": 0.40
            },
            {
                "instruction": (
                    "Examine character development and dialogue. "
                    "AI tends to: create flat characters, use formal dialogue, lack authentic speech patterns. "
                    "Humans: create complex characters, use natural dialogue, include speech quirks. "
                    'Respond with ONLY JSON: {"ai_score": [number], "explanation": "[reason]"}'
                ),
                "weight": 0.30
            },
            {
                "instruction": (
                    "Assess emotional authenticity and narrative voice. "
                    "AI often lacks: genuine emotional depth, consistent personal voice, lived experience details. "
                    "Human writing shows: authentic emotions, unique perspective, specific sensory details. "
                    'Return ONLY: {"ai_score": [0-100], "explanation": "[brief reason]"}'
                ),
                "weight": 0.30
            }
        ]
    else:
        # General document prompts
        prompts = [
            {
                "instruction": (
                    "Analyze this document for AI generation patterns. Focus on subtle indicators: "
                    "sentence rhythm variation, authentic mistakes, personal anecdotes, emotional inconsistencies, "
                    "natural topic drift, colloquialisms. Avoid over-weighting formal language in professional documents. "
                    'Score 0-100 where 100=certainly AI. Return ONLY: {"ai_score": [number], "explanation": "[reason]"}'
                ),
                "weight": 0.25
            },
            {
                "instruction": (
                    "Examine the authenticity of ideas and examples in this text. "
                    "AI often uses: generic examples, Wikipedia-like descriptions, safe opinions. "
                    "Humans use: specific personal examples, unique perspectives, controversial opinions. "
                    'Respond ONLY with: {"ai_score": [0-100], "explanation": "[reason]"}'
                ),
                "weight": 0.25
            },
            {
                "instruction": (
                    "Assess writing flow and natural imperfections. "
                    "Perfect grammar and consistent style throughout suggests AI. "
                    "Natural human imperfections include: typos, inconsistent formatting, colloquialisms, topic drift. "
                    'Return ONLY JSON: {"ai_score": [number], "explanation": "[brief reason]"}'
                ),
                "weight": 0.25
            },
            {
                "instruction": (
                    "Evaluate the presence of genuine human experience markers. "
                    "Look for: specific timestamps, personal struggles, unique insights, emotional authenticity. "
                    "Generic descriptions and lack of specific details suggest AI. "
                    'Output ONLY: {"ai_score": [0-100], "explanation": "[reason]"}'
                ),
                "weight": 0.25
            }
        ]
    
    scores = []
    explanations = []
    
    for prompt_data in prompts:
        try:
            user_content = f"{prompt_data['instruction']}\n\nDocument text to analyze:\n\n{text[:3000]}"
            
            payload = {
                "messages": [
                    {
                        "role": "user", 
                        "content": [{"text": user_content}]
                    }
                ],
                "inferenceConfig": {
                    "maxTokens": 150,
                    "temperature": 0.1,  # Slightly higher for nuanced analysis
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
            
            if "output" in model_payload and "message" in model_payload["output"]:
                content = model_payload["output"]["message"].get("content", [])
                if content and isinstance(content, list) and len(content) > 0:
                    raw_output = content[0].get("text", "")
            
            logger.info(f"Raw Nova output: {raw_output[:200]}")
            
            try:
                cleaned_output = raw_output.strip()
                if cleaned_output.startswith('```json'):
                    cleaned_output = cleaned_output.replace('```json', '', 1).strip()
                if cleaned_output.endswith('```'):
                    cleaned_output = cleaned_output.rstrip('```').strip()
                
                parsed = json.loads(cleaned_output)
                score = int(float(parsed.get("ai_score", 50)))
                explanation = parsed.get("explanation", "")
                
                scores.append((score, prompt_data['weight']))
                explanations.append(explanation)
                
            except Exception as e:
                logger.warning(f"Parse error: {str(e)}")
                scores.append((50, prompt_data['weight']))
                explanations.append(f"Parse error: {str(e)[:50]}")
                
        except Exception as e:
            logger.error(f"Bedrock API error: {str(e)}")
            scores.append((50, prompt_data['weight']))
            explanations.append(f"API Error: {str(e)[:50]}")
    
    # Calculate weighted average with confidence adjustment
    if scores:
        weighted_sum = sum(score * weight for score, weight in scores)
        total_weight = sum(weight for _, weight in scores)
        ensemble_score = int(weighted_sum / total_weight) if total_weight > 0 else 50
        
        # Calculate confidence based on score agreement
        score_values = [s for s, _ in scores]
        if len(score_values) > 1:
            score_std = statistics.stdev(score_values)
            # High disagreement reduces confidence in extreme scores
            if score_std > 20:
                # Pull score toward center when models disagree
                ensemble_score = int(ensemble_score * 0.7 + 50 * 0.3)
    else:
        ensemble_score = 50
    
    return ensemble_score, " | ".join(explanations[:2])

def enhanced_comprehend_analysis(text, comprehend):
    """
    Enhanced Comprehend analysis with multiple features.
    """
    try:
        text_for_comprehend = text[:5000] if len(text) > 5000 else text
        
        # Sentiment analysis
        sentiment_result = comprehend.detect_sentiment(Text=text_for_comprehend, LanguageCode="en")
        sentiment = sentiment_result.get("Sentiment", "NEUTRAL")
        sentiment_scores = sentiment_result.get("SentimentScore", {})
        
        # Key phrases
        key_phrases_result = comprehend.detect_key_phrases(Text=text_for_comprehend, LanguageCode="en")
        key_phrases = [kp["Text"] for kp in key_phrases_result.get("KeyPhrases", [])]
        
        # Named entities
        entities_result = comprehend.detect_entities(Text=text_for_comprehend, LanguageCode="en")
        entities = entities_result.get("Entities", [])
        
        # Dominant language
        language_result = comprehend.detect_dominant_language(Text=text_for_comprehend)
        dominant_language = language_result.get("Languages", [{}])[0].get("LanguageCode", "en")
        
        # Syntax analysis (if available)
        syntax_result = comprehend.detect_syntax(Text=text_for_comprehend, LanguageCode="en")
        syntax_tokens = syntax_result.get("SyntaxTokens", [])
        
        return {
            "sentiment": sentiment,
            "sentiment_scores": sentiment_scores,
            "key_phrases": key_phrases,
            "entities": entities,
            "dominant_language": dominant_language,
            "syntax_tokens": syntax_tokens
        }
        
    except Exception as e:
        logger.warning(f"Enhanced Comprehend analysis failed: {str(e)}")
        return {
            "sentiment": "UNKNOWN",
            "sentiment_scores": {},
            "key_phrases": [],
            "entities": [],
            "dominant_language": "en",
            "syntax_tokens": []
        }

def analyze_text(text, comprehend, bedrock):
    """
    Enhanced analysis with multiple sophisticated detection methods.
    """
    
    # Enhanced Comprehend analysis
    comprehend_results = enhanced_comprehend_analysis(text, comprehend)
    sentiment = comprehend_results["sentiment"]
    sentiment_scores = comprehend_results["sentiment_scores"]
    key_phrases = comprehend_results["key_phrases"]
    entities = comprehend_results["entities"]
    dominant_language = comprehend_results["dominant_language"]
    syntax_tokens = comprehend_results["syntax_tokens"]

    # Enhanced multi-method detection
    try:
        # 1. Advanced linguistic analysis (30% weight)
        linguistic_score, linguistic_features = enhanced_linguistic_analysis(text)
        
        # 2. Adaptive AI prompt ensemble (50% weight)
        text_for_bedrock = text[:3000] if len(text) > 3000 else text
        ensemble_score, ensemble_explanation = adaptive_prompt_ensemble(text_for_bedrock, bedrock)
        
        # 3. Document length penalty adjustment
        length_adjustment = 0
        word_count = len(text.split())
        
        # Very short documents are harder to assess accurately
        if word_count < 100:
            length_adjustment = -10  # Reduce confidence
        elif word_count > 2000:
            # Long documents with consistent tone might be AI
            sentences = re.split(r'[.!?]+', text)
            if len(sentences) > 50:
                # Check consistency across document
                first_quarter = ' '.join(sentences[:len(sentences)//4])
                last_quarter = ' '.join(sentences[3*len(sentences)//4:])
                
                # If writing style is very consistent throughout, more likely AI
                first_words = set(re.findall(r'\b\w+\b', first_quarter.lower()))
                last_words = set(re.findall(r'\b\w+\b', last_quarter.lower()))
                
                if first_words and last_words:
                    style_consistency = len(first_words & last_words) / len(first_words | last_words)
                    if style_consistency > 0.6:
                        length_adjustment = 5
        
        # 4. Combine scores with adaptive weighting
        base_score = (linguistic_score * 0.30) + (ensemble_score * 0.50)
        
        # 5. Sentiment-based adjustment (10% influence)
        sentiment_adjustment = 0
        if sentiment == "POSITIVE":
            positive_conf = sentiment_scores.get("Positive", 0)
            negative_conf = sentiment_scores.get("Negative", 0)
            
            # Extremely positive with no negativity is suspicious
            if positive_conf > 0.95 and negative_conf < 0.01:
                sentiment_adjustment = 10
            elif positive_conf > 0.85:
                sentiment_adjustment = 5
        
        # 6. Key phrase analysis (10% influence)
        kp_adjustment = 0
        if key_phrases:
            # Check for overly professional/generic key phrases
            generic_phrases = sum(1 for kp in key_phrases if len(kp.split()) > 3)
            if generic_phrases > 5:
                kp_adjustment = 5
        
        # Calculate final score
        final_score = base_score + length_adjustment + sentiment_adjustment + kp_adjustment
        
        # Apply confidence bounds based on document characteristics
        confidence_level = "high"
        
        # Reduce confidence for edge cases
        if word_count < 100:
            confidence_level = "low"
            final_score = final_score * 0.8 + 50 * 0.2  # Pull toward neutral
        elif word_count < 300:
            confidence_level = "medium"
            final_score = final_score * 0.9 + 50 * 0.1
        
        # Cap the score to reasonable bounds
        final_score = max(5, min(int(final_score), 95))
        
        # Create a concise, structured explanation
        
        # Extract and shorten the main analysis
        ensemble_parts = ensemble_explanation.split('|')
        main_analysis = ensemble_parts[0].strip() if ensemble_parts else ensemble_explanation
        
        # Limit to first 150 characters or 2 sentences
        if len(main_analysis) > 150:
            sentences = main_analysis.split('.')
            main_analysis = sentences[0] + '.' if sentences else main_analysis[:150]
        
        # Get linguistic metrics
        perp = linguistic_features.get('perplexity', 0)
        burst = linguistic_features.get('burstiness', 0) 
        artifacts = linguistic_features.get('artifacts', 0)
        
        # Build compact explanation with visual separators
        explanation = (
            f"{main_analysis}\n"
            f"├─ Perplexity: {perp}%\n"
            f"├─ Burstiness: {burst}%\n"
            f"├─ AI Markers: {artifacts}%\n"
            f"└─ Confidence: {confidence_level.capitalize()}"
        )
        
    except Exception as e:
        logger.error(f"Enhanced analysis error: {str(e)}")
        final_score = 50
        explanation = f"Analysis error: {str(e)}"
        linguistic_features = {}

    return {
        "sentiment": sentiment,
        "key_phrases": key_phrases,
        "ai_score": final_score,
        "explanation": explanation,
        "linguistic_features": linguistic_features,
        "ensemble_score": ensemble_score,
        "comprehend_analysis": {
            "sentiment_scores": sentiment_scores,
            "entities": entities[:10],
            "dominant_language": dominant_language,
            "syntax_complexity": len(syntax_tokens) if syntax_tokens else 0
        }
    }

# Keep all the existing handler functions unchanged
def lambda_handler(event, context):
    """Main Lambda handler with enhanced CORS support"""
    logger.info(f"Processing event: {json.dumps(event)}")
    
    if event.get("httpMethod") == "OPTIONS":
        return handle_options_request()
    
    try:
        if event.get("body"):
            body = json.loads(event.get("body", "{}"))
            action = body.get("action")
            
            if action == "upload_and_analyze":
                return handle_upload_and_analyze(body)
        
        if event.get("Records"):
            return handle_s3_event(event)
        
        body = json.loads(event.get("body", "{}"))
        bucket_name = body.get("bucket_name", BUCKET_NAME)
        object_key = body.get("object_key", "")
        if not object_key:
            return {
                "statusCode": 400,
                "headers": get_cors_headers(),
                "body": json.dumps({"error": "No object_key provided"})
            }
        
        return analyze_existing_document(bucket_name, object_key)

    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return {
            "statusCode": 400,
            "headers": get_cors_headers(),
            "body": json.dumps({"error": "Invalid JSON in request body"})
        }
    except Exception as e:
        logger.error(f"Lambda execution error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": get_cors_headers(),
            "body": json.dumps({"error": str(e)})
        }

def handle_upload_and_analyze(body):
    """Handle file upload and immediate analysis"""
    try:
        file_name = body.get("fileName")
        file_type = body.get("fileType")
        file_content = body.get("fileContent")
        bucket_name = body.get("bucketName", BUCKET_NAME)
        
        if not all([file_name, file_type, file_content]):
            return {
                "statusCode": 400,
                "headers": get_cors_headers(),
                "body": json.dumps({"error": "Missing required fields: fileName, fileType, fileContent"})
            }
        
        s3, dynamodb, comprehend, bedrock = get_clients()
        
        import base64
        file_bytes = base64.b64decode(file_content)
        s3.put_object(
            Bucket=bucket_name,
            Key=file_name,
            Body=file_bytes,
            ContentType=file_type
        )
        
        logger.info(f"Uploaded {file_name} to S3")
        
        return analyze_existing_document(bucket_name, file_name)
        
    except Exception as e:
        logger.error(f"Upload and analyze error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": get_cors_headers(),
            "body": json.dumps({"error": f"Upload failed: {str(e)}"})
        }

def handle_s3_event(event):
    """Handle S3 event triggers"""
    try:
        record = event["Records"][0]
        bucket_name = record["s3"]["bucket"]["name"]
        object_key = unquote_plus(record["s3"]["object"]["key"])
        logger.info(f"Processing S3 event: {bucket_name}/{object_key}")
        
        return analyze_existing_document(bucket_name, object_key)
        
    except Exception as e:
        logger.error(f"S3 event handling error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": get_cors_headers(),
            "body": json.dumps({"error": str(e)})
        }

def analyze_existing_document(bucket_name, object_key):
    """Analyze an existing document in S3"""
    try:
        s3, dynamodb, comprehend, bedrock = get_clients()
        table = dynamodb.Table(TABLE_NAME)

        extracted_text, extraction_method = extract_text_from_document(s3, bucket_name, object_key)
        if len(extracted_text) < 10:
            return {
                "statusCode": 400,
                "headers": get_cors_headers(),
                "body": json.dumps({"error": "Extracted text too short"})
            }

        analysis_results = analyze_text(extracted_text, comprehend, bedrock)
        sentiment = analysis_results.get("sentiment", "NEUTRAL")
        key_phrases = analysis_results.get("key_phrases", [])
        ai_score = analysis_results.get("ai_score", 50)
        explanation = analysis_results.get("explanation", "Analysis completed")
        linguistic_features = analysis_results.get("linguistic_features", {})
        ensemble_score = analysis_results.get("ensemble_score", 50)
        comprehend_analysis = analysis_results.get("comprehend_analysis", {})

        try:
            obj_metadata = s3.head_object(Bucket=bucket_name, Key=object_key)
            file_size = obj_metadata['ContentLength']
            last_modified = obj_metadata['LastModified'].isoformat()
        except Exception as e:
            logger.warning(f"Metadata fetch failed: {str(e)}")
            file_size, last_modified = 0, ""

        item = {
            "id": str(uuid.uuid4()),
            "timestamp": str(int(time.time())),
            "bucket_name": bucket_name,
            "object_key": object_key,
            "file_size": file_size,
            "last_modified": last_modified,
            "extraction_method": extraction_method,
            "input_text": extracted_text[:1000],
            "text_length": len(extracted_text),
            "ai_score": ai_score,
            "explanation": explanation[:500],
            "sentiment": sentiment,
            "key_phrases": key_phrases[:10],
            "analysis_version": "document_v3_enhanced",
            "source_type": "document"
        }

        try:
            table.put_item(Item=item)
            logger.info(f"Stored analysis in DynamoDB for {object_key}")
        except Exception as e:
            logger.error(f"Failed DynamoDB write: {str(e)}")

        try:
            result_key = f"analysis-results/{item['id']}.json"
            s3.put_object(
                Bucket=BUCKET_NAME,
                Key=result_key,
                Body=json.dumps(item, indent=2),
                ContentType="application/json"
            )
            logger.info(f"Saved results to s3://{BUCKET_NAME}/{result_key}")
        except Exception as e:
            logger.error(f"Failed S3 write: {str(e)}")

        # Enhanced response with comprehensive analysis
        response_body = {
            "document_id": item["id"],
            "object_key": object_key,
            "ai_score": ai_score,
            "explanation": explanation,
            "sentiment": sentiment,
            "key_phrases": key_phrases,
            "confidence": "high" if ai_score < 20 or ai_score > 80 else "medium",
            "text_length": len(extracted_text),
            "extraction_method": extraction_method,
            "input_text": extracted_text[:1000],
            "analysis_version": "document_v4_enhanced",
            "comprehend_analysis": comprehend_analysis,
            "linguistic_features": linguistic_features,
            "detection_breakdown": {
                "linguistic_score": linguistic_features.get("perplexity", 50),
                "ensemble_score": ensemble_score,
                "confidence_level": "high" if ai_score < 20 or ai_score > 80 else "medium"
            }
        }

        return {
            "statusCode": 200,
            "headers": get_cors_headers(),
            "body": json.dumps(response_body)
        }

    except Exception as e:
        logger.error(f"Document analysis error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": get_cors_headers(),
            "body": json.dumps({"error": str(e)})
        }