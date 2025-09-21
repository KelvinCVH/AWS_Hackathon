import json
import uuid
import time
import boto3
import os
import re
import statistics
from collections import Counter
import math

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


def calculate_perplexity_proxy(text):
    """Calculate a proxy for perplexity based on word frequency patterns."""
    words = re.findall(r'\b[a-z]+\b', text.lower())
    if len(words) < 10:
        return 0
    
    # Common words that appear frequently in natural text
    common_words = set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 
                        'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 
                        'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 
                        'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 
                        'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 
                        'if', 'about', 'who', 'get', 'which', 'go', 'me'])
    
    # Calculate word diversity and commonality
    word_freq = Counter(words)
    unique_ratio = len(set(words)) / len(words)
    common_ratio = sum(1 for w in words if w in common_words) / len(words)
    
    # Human text tends to have more varied vocabulary but also uses common words naturally
    # AI text often has either too much variety (trying to sound sophisticated) or too little
    perplexity_score = 0
    
    if 0.4 < unique_ratio < 0.8:  # Natural range for human text
        perplexity_score += 30
    if 0.3 < common_ratio < 0.6:  # Natural use of common words
        perplexity_score += 30
        
    return perplexity_score


def detect_human_patterns(text):
    """Detect patterns that strongly indicate human authorship."""
    human_score = 0
    human_indicators = []
    
    text_lower = text.lower()
    
    # 1. Personal pronouns and experiences
    personal_patterns = [
        r'\b(my|our|we|us)\s+(family|friend|wife|husband|kid|child|son|daughter|mom|dad|brother|sister)',
        r'\b(i|we)\s+(bought|tried|visited|went|saw|heard|felt|thought)',
        r'\b(yesterday|today|last\s+week|last\s+month|this\s+morning|tonight)',
        r'\b(honestly|personally|actually|literally|basically|seriously)\b',
    ]
    
    for pattern in personal_patterns:
        if re.search(pattern, text_lower):
            human_score += 15
            human_indicators.append("personal_experience")
            break
    
    # 2. Informal language and contractions
    informal_patterns = [
        r"\b(won't|can't|didn't|doesn't|isn't|aren't|wasn't|weren't|i'm|i've|i'd|we're|they're|you're)\b",
        r"\b(gonna|wanna|gotta|kinda|sorta|yeah|yep|nope|ok|okay|hey|wow|oh|ah|ugh|hmm)\b",
        r"\b(lol|haha|omg|btw|fyi|imo|imho|tbh|idk|thx|ty)\b",
    ]
    
    informal_count = sum(1 for pattern in informal_patterns 
                        for _ in re.finditer(pattern, text_lower))
    if informal_count > 0:
        human_score += min(20, informal_count * 10)
        human_indicators.append("informal_language")
    
    # 3. Typos and imperfections (careful not to penalize correct spelling)
    # Look for common typo patterns
    typo_patterns = [
        r'\b(teh|thier|recieve|occured|untill|wich|becuase|alot)\b',
        r'([a-z])\1{3,}',  # Repeated characters like "soooo" or "realllly"
        r'\s{2,}',  # Multiple spaces
        r'[.!?]{2,}',  # Multiple punctuation
    ]
    
    typo_count = sum(1 for pattern in typo_patterns 
                    for _ in re.finditer(pattern, text_lower))
    if typo_count > 0:
        human_score += min(15, typo_count * 5)
        human_indicators.append("natural_imperfections")
    
    # 4. Emotional expressions and subjective opinions
    emotion_patterns = [
        r'\b(love|hate|annoying|frustrated|excited|happy|sad|angry|disappointed|surprised)\b',
        r'[!]{2,}',  # Multiple exclamation marks
        r'\b(best|worst|terrible|awesome|amazing|horrible|disgusting|delicious)\b',
    ]
    
    emotion_count = sum(1 for pattern in emotion_patterns 
                       for _ in re.finditer(pattern, text_lower))
    if emotion_count > 1:
        human_score += min(15, emotion_count * 5)
        human_indicators.append("emotional_expression")
    
    # 5. Specific details (prices, dates, names, places)
    specific_patterns = [
        r'\$\d+',  # Prices
        r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',  # Dates
        r'\b[A-Z][a-z]+ [A-Z][a-z]+\b',  # Proper names
        r'\b\d+\s*(minutes?|hours?|days?|weeks?|months?|years?)\s+ago\b',
        r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\b',
    ]
    
    specific_count = sum(1 for pattern in specific_patterns 
                        for _ in re.finditer(pattern, text))
    if specific_count > 0:
        human_score += min(20, specific_count * 10)
        human_indicators.append("specific_details")
    
    return human_score, human_indicators


def detect_ai_patterns(text):
    """Enhanced AI pattern detection with reduced false positives."""
    ai_score = 0
    ai_indicators = []
    
    text_lower = text.lower()
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    # 1. Overused AI phrases (but check context)
    ai_phrases = {
        # Very strong AI indicators (rarely used naturally by humans)
        "high_confidence": [
            "it is worth noting that", "it should be emphasized", 
            "one must consider", "it is important to note",
            "in today's fast-paced", "in the ever-evolving",
            "seamlessly blends", "truly exceptional experience",
            "exceeded all expectations", "nothing short of",
            "testament to", "epitome of", "pinnacle of"
        ],
        # Moderate AI indicators (sometimes used by humans)
        "moderate_confidence": [
            "furthermore", "moreover", "consequently",
            "comprehensive", "innovative", "cutting-edge",
            "game-changer", "revolutionary", "state-of-the-art"
        ]
    }
    
    high_ai_count = sum(1 for phrase in ai_phrases["high_confidence"] 
                       if phrase in text_lower)
    moderate_ai_count = sum(1 for phrase in ai_phrases["moderate_confidence"] 
                          if phrase in text_lower)
    
    # Only flag if multiple AI phrases present
    if high_ai_count > 0:
        ai_score += min(30, high_ai_count * 15)
        ai_indicators.append("formulaic_phrases")
    if moderate_ai_count > 2:  # Need multiple moderate indicators
        ai_score += min(15, moderate_ai_count * 5)
        ai_indicators.append("ai_vocabulary")
    
    # 2. Structural patterns
    if len(sentences) > 3:
        # Check for overly consistent sentence lengths
        sentence_lengths = [len(s.split()) for s in sentences]
        if len(sentence_lengths) > 1:
            cv = statistics.stdev(sentence_lengths) / statistics.mean(sentence_lengths)
            if cv < 0.2:  # Very low coefficient of variation
                ai_score += 20
                ai_indicators.append("uniform_structure")
        
        # Check for repetitive sentence starters
        starters = [s.split()[0].lower() for s in sentences if s.split()]
        if len(starters) > 3:
            starter_freq = Counter(starters)
            if max(starter_freq.values()) > len(starters) * 0.4:
                ai_score += 15
                ai_indicators.append("repetitive_starters")
    
    # 3. Lack of specificity combined with superlatives
    superlatives = ["best", "perfect", "excellent", "outstanding", "exceptional", 
                   "remarkable", "extraordinary", "phenomenal", "impeccable"]
    superlative_count = sum(1 for word in superlatives if word in text_lower)
    
    # Check if superlatives are used without specific details
    has_specific_details = bool(re.search(r'\$\d+|\d+\s*(minutes?|hours?|days?)', text))
    if superlative_count > 2 and not has_specific_details:
        ai_score += 20
        ai_indicators.append("vague_superlatives")
    
    # 4. Perfect grammar and punctuation (but be careful here)
    # Only flag if text is long and has NO informal elements at all
    if len(text) > 200:
        has_contractions = bool(re.search(r"\b\w+'\w+\b", text))
        has_informal = bool(re.search(r'\b(yeah|ok|kinda|sorta|gonna)\b', text_lower))
        has_errors = bool(re.search(r'[.!?]\s+[a-z]|\s{2,}', text))  # Capital after period
        
        if not has_contractions and not has_informal and not has_errors:
            ai_score += 15
            ai_indicators.append("overly_polished")
    
    return ai_score, ai_indicators


def enhanced_linguistic_analysis(text):
    """Comprehensive linguistic analysis with better human/AI discrimination."""
    
    # Get human and AI pattern scores
    human_score, human_indicators = detect_human_patterns(text)
    ai_score, ai_indicators = detect_ai_patterns(text)
    
    # Calculate perplexity-like score
    perplexity_score = calculate_perplexity_proxy(text)
    
    # Additional metrics
    words = text.split()
    unique_words = set(w.lower() for w in words)
    
    # Vocabulary diversity (but account for text length)
    expected_unique = min(len(words) * 0.7, 100)  # Adjust expectation based on length
    diversity_ratio = len(unique_words) / expected_unique
    
    # Sentence complexity variation
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 5]
    
    complexity_score = 0
    if len(sentences) > 2:
        # Mix of simple and complex sentences is human-like
        lengths = [len(s.split()) for s in sentences]
        has_short = any(l < 8 for l in lengths)
        has_medium = any(8 <= l <= 20 for l in lengths)
        has_long = any(l > 20 for l in lengths)
        
        if has_short and has_medium:
            complexity_score += 20  # Natural mix
        if has_short and has_long:
            complexity_score += 10  # Varied complexity
    
    # Calculate final score (0-100, where 100 = definitely AI)
    # Weight human indicators more heavily to reduce false positives
    base_score = 50  # Start neutral
    
    # Adjust based on indicators
    base_score -= (human_score * 0.8)  # Human patterns reduce AI likelihood more
    base_score += (ai_score * 0.6)  # AI patterns increase AI likelihood less
    base_score -= (perplexity_score * 0.3)
    base_score -= (complexity_score * 0.3)
    
    # Ensure bounds
    final_score = max(0, min(100, base_score))
    
    # If strong human indicators present, cap the AI score
    if len(human_indicators) >= 3:
        final_score = min(final_score, 30)
    elif len(human_indicators) >= 2:
        final_score = min(final_score, 40)
    
    # If no AI indicators but has human indicators, strongly reduce score
    if len(ai_indicators) == 0 and len(human_indicators) > 0:
        final_score = min(final_score, 25)
    
    features = {
        "human_indicators": human_indicators,
        "ai_indicators": ai_indicators,
        "human_score": human_score,
        "ai_pattern_score": ai_score,
        "perplexity_proxy": perplexity_score,
        "complexity_variation": complexity_score
    }
    
    return final_score, features


def analyze_with_nova_pro(text, bedrock):
    """Enhanced Nova Pro analysis with better prompting and proper token limits."""
    
    prompts = [
        {
            "instruction": (
                "Analyze if this text is AI-generated or human-written. Focus on:\n"
                "HUMAN indicators: Personal stories, specific details (dates/prices/names), "
                "informal language, emotions, opinions, typos, contractions like I'm/don't, "
                "inconsistent style, unique experiences.\n"
                "AI indicators: Generic phrases, perfect grammar throughout, formal transitions "
                "(furthermore/moreover), vague superlatives without specifics, consistent structure.\n"
                "IMPORTANT: Default to human unless clear AI patterns. Many humans write well too.\n"
                "Score 0-100 (0=definitely human, 100=definitely AI).\n"
                'Respond ONLY with: {"ai_score": [number], "explanation": "[brief reason under 50 words]"}'
            ),
            "weight": 0.5
        },
        {
            "instruction": (
                "Is this written by a real person or AI? Check for:\n"
                "Real person signs: Mentions specific people/places/times, uses 'I/we/my', "
                "shows emotion or frustration, has opinions, casual tone.\n"
                "AI signs: Sounds like a template, too perfect, no personal touch, "
                "overuses words like 'comprehensive/innovative/seamless'.\n"
                "Be skeptical of calling it AI - humans can write formally too.\n"
                'Score 0-100 where lower=more human. Format: {"ai_score": [number], "explanation": "[reason under 50 words]"}'
            ),
            "weight": 0.5
        }
    ]
    
    scores = []
    explanations = []
    
    for prompt_data in prompts:
        try:
            # Include text sample for better context
            text_sample = text[:500] if len(text) > 500 else text
            user_content = f"{prompt_data['instruction']}\n\nText to analyze:\n{text_sample}"
            
            payload = {
                "messages": [
                    {
                        "role": "user", 
                        "content": [{"text": user_content}]
                    }
                ],
                "inferenceConfig": {
                    "maxTokens": 300,  # Increased from 100 to 300 for complete responses
                    "temperature": 0.1,  # Low but not zero for some variation
                    "topP": 0.9,  # Add topP for better control
                    "stopSequences": ["\n\n", "}", '"}']  # Stop after JSON closes
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
            
            print(f"[DEBUG] Nova Pro raw output: {raw_output[:200]}")  # Debug logging
            
            # Parse response with better error handling
            try:
                cleaned = raw_output.strip()
                
                # Remove code block markers if present
                if cleaned.startswith('```'):
                    cleaned = re.sub(r'```[a-z]*\n?', '', cleaned)
                    cleaned = cleaned.rstrip('```').strip()
                
                # Extract JSON if it's embedded in text
                json_match = re.search(r'\{[^}]*"ai_score"[^}]*\}', cleaned)
                if json_match:
                    cleaned = json_match.group()
                
                # Fix common JSON issues
                # Handle incomplete JSON by adding closing brace
                if cleaned.count('{') > cleaned.count('}'):
                    cleaned += '}'
                
                # Truncate explanation if it's cut off
                if '"explanation": "' in cleaned and not cleaned.rstrip().endswith('"}'):
                    # Find where explanation starts and close it properly
                    exp_start = cleaned.find('"explanation": "') + len('"explanation": "')
                    exp_end = cleaned.find('"', exp_start)
                    if exp_end == -1:
                        # Explanation was cut off, close it
                        cleaned = cleaned.rstrip() + '"}'
                
                parsed = json.loads(cleaned)
                score = int(float(parsed.get("ai_score", 50)))
                explanation = parsed.get("explanation", "")
                
                # Truncate explanation if too long
                if len(explanation) > 200:
                    explanation = explanation[:197] + "..."
                
                scores.append((score, prompt_data['weight']))
                explanations.append(explanation)
                
            except json.JSONDecodeError as je:
                print(f"[WARN] JSON parsing failed: {je}")
                print(f"[WARN] Attempted to parse: {cleaned[:200]}")
                
                # Fallback: try to extract score from text
                score_match = re.search(r'"ai_score"\s*:\s*(\d+)', raw_output)
                if score_match:
                    score = int(score_match.group(1))
                    scores.append((score, prompt_data['weight']))
                    
                    # Try to extract explanation
                    exp_match = re.search(r'"explanation"\s*:\s*"([^"]*)', raw_output)
                    if exp_match:
                        explanations.append(exp_match.group(1))
                    else:
                        explanations.append("Analysis completed")
                else:
                    # Final fallback based on keywords
                    if "human" in raw_output.lower() and "ai" not in raw_output.lower():
                        scores.append((20, prompt_data['weight']))
                    elif "ai" in raw_output.lower() and "human" not in raw_output.lower():
                        scores.append((80, prompt_data['weight']))
                    else:
                        scores.append((50, prompt_data['weight']))
                    explanations.append("Parsed from text analysis")
                
        except Exception as e:
            print(f"[ERROR] Nova Pro analysis error: {str(e)}")
            scores.append((50, prompt_data['weight']))
            explanations.append(f"Analysis error: {str(e)[:30]}")
    
    # Calculate weighted average
    if scores:
        weighted_sum = sum(score * weight for score, weight in scores)
        total_weight = sum(weight for _, weight in scores)
        ensemble_score = int(weighted_sum / total_weight)
    else:
        ensemble_score = 50
    
    # Combine explanations, ensuring they're not cut off
    final_explanation = " | ".join(filter(None, explanations[:2]))
    if len(final_explanation) > 300:
        final_explanation = final_explanation[:297] + "..."
    
    return ensemble_score, final_explanation


def enhanced_comprehend_analysis(text, comprehend):
    """More meaningful semantic analysis using Comprehend."""
    
    results = {
        "sentiment": {},
        "entities": [],
        "key_phrases": [],
        "syntax_complexity": "unknown",
        "dominant_language_features": []
    }
    
    try:
        # 1. Sentiment Analysis with confidence scores
        sentiment_result = comprehend.detect_sentiment(Text=text[:5000], LanguageCode="en")
        results["sentiment"] = {
            "primary": sentiment_result.get("Sentiment", "NEUTRAL"),
            "scores": sentiment_result.get("SentimentScore", {}),
            "mixed": sentiment_result.get("SentimentScore", {}).get("Mixed", 0) > 0.3
        }
        
        # 2. Entity Recognition (people, places, organizations, etc.)
        entities_result = comprehend.detect_entities(Text=text[:5000], LanguageCode="en")
        entities = entities_result.get("Entities", [])
        results["entities"] = [
            {"text": e["Text"], "type": e["Type"], "score": e["Score"]}
            for e in entities[:10]  # Limit to top 10
        ]
        
        # 3. Key Phrases with scores
        key_phrases_result = comprehend.detect_key_phrases(Text=text[:5000], LanguageCode="en")
        phrases = key_phrases_result.get("KeyPhrases", [])
        results["key_phrases"] = [
            {"text": p["Text"], "score": p["Score"]}
            for p in sorted(phrases, key=lambda x: x["Score"], reverse=True)[:10]
        ]
        
        # 4. Syntax Analysis (if needed for complexity assessment)
        if len(text) < 2000:  # Only for shorter texts due to API limits
            syntax_result = comprehend.detect_syntax(Text=text, LanguageCode="en")
            tokens = syntax_result.get("SyntaxTokens", [])
            
            # Analyze POS distribution
            pos_tags = [t["PartOfSpeech"]["Tag"] for t in tokens]
            noun_ratio = pos_tags.count("NOUN") / len(pos_tags) if pos_tags else 0
            verb_ratio = pos_tags.count("VERB") / len(pos_tags) if pos_tags else 0
            adj_ratio = pos_tags.count("ADJ") / len(pos_tags) if pos_tags else 0
            
            # Determine complexity
            if noun_ratio > 0.3:
                results["syntax_complexity"] = "noun_heavy"
                results["dominant_language_features"].append("descriptive")
            if verb_ratio > 0.2:
                results["dominant_language_features"].append("action_oriented")
            if adj_ratio > 0.15:
                results["dominant_language_features"].append("adjective_rich")
        
        # 5. Detect review-specific patterns
        if "sentiment" in results and results["sentiment"]["primary"] == "POSITIVE":
            positive_conf = results["sentiment"]["scores"].get("Positive", 0)
            if positive_conf > 0.95:
                results["dominant_language_features"].append("extremely_positive")
        
        # Check for personal pronouns in entities or key phrases
        personal_indicators = ["I", "my", "we", "our", "me", "us"]
        has_personal = any(
            indicator.lower() in text.lower() 
            for indicator in personal_indicators
        )
        if has_personal:
            results["dominant_language_features"].append("first_person_narrative")
            
    except Exception as e:
        print(f"[WARN] Comprehend analysis error: {e}")
    
    return results


def calculate_final_score(linguistic_score, nova_score, comprehend_results, text):
    """Calculate final AI detection score with all factors considered."""
    
    # Base weights
    weights = {
        "linguistic": 0.45,  # Our linguistic analysis
        "nova": 0.45,       # Nova Pro analysis
        "comprehend": 0.10   # Comprehend adjustments
    }
    
    # Start with weighted base
    final_score = (linguistic_score * weights["linguistic"]) + (nova_score * weights["nova"])
    
    # Comprehend adjustments
    comprehend_adjustment = 0
    
    # 1. Entities suggest human authorship
    if len(comprehend_results.get("entities", [])) > 3:
        comprehend_adjustment -= 5  # More specific entities = more likely human
    
    # 2. First person narrative
    if "first_person_narrative" in comprehend_results.get("dominant_language_features", []):
        comprehend_adjustment -= 10
    
    # 3. Mixed sentiment (humans are less consistent)
    if comprehend_results.get("sentiment", {}).get("mixed", False):
        comprehend_adjustment -= 5
    
    # 4. Extremely positive without specifics (potential AI)
    if "extremely_positive" in comprehend_results.get("dominant_language_features", []):
        key_phrases = comprehend_results.get("key_phrases", [])
        has_specifics = any(
            any(char.isdigit() for char in kp["text"]) 
            for kp in key_phrases
        )
        if not has_specifics:
            comprehend_adjustment += 10
    
    # Apply Comprehend adjustments
    final_score += comprehend_adjustment * weights["comprehend"]
    
    # Final bounds and adjustments
    final_score = max(0, min(100, final_score))
    
    # Conservative bias toward human (reduce false positives)
    # If score is borderline, lean toward human
    if 30 <= final_score <= 70:
        # Check for any strong human indicators
        if "I" in text or "my" in text.lower() or "we" in text.lower():
            final_score = max(0, final_score - 10)
    
    return int(final_score)


def lambda_handler(event, context):
    """Main Lambda handler with enhanced detection."""
    
    # Parse input
    body = json.loads(event.get("body", "{}"))
    text = body.get("text", "").strip()
    
    # Validation
    if not text:
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            "body": json.dumps({"error": "No text provided"})
        }
    
    if len(text) < 20:
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            "body": json.dumps({"error": "Text too short for meaningful analysis (minimum 20 characters)"})
        }
    
    # Initialize clients
    dynamodb, comprehend, bedrock = get_clients()
    table = dynamodb.Table(TABLE_NAME)
    
    try:
        # 1. Enhanced linguistic analysis
        linguistic_score, linguistic_features = enhanced_linguistic_analysis(text)
        
        # 2. Nova Pro analysis
        nova_score, nova_explanation = analyze_with_nova_pro(text, bedrock)
        
        # 3. Comprehend semantic analysis
        comprehend_results = enhanced_comprehend_analysis(text, comprehend)
        
        # 4. Calculate final score
        final_score = calculate_final_score(
            linguistic_score, nova_score, comprehend_results, text
        )
        
        # 5. Determine confidence level
        if final_score < 20 or final_score > 80:
            confidence = "high"
        elif final_score < 35 or final_score > 65:
            confidence = "medium"
        else:
            confidence = "low"
        
        # 6. Generate explanation
        explanation_parts = []
        
        if linguistic_features.get("human_indicators"):
            explanation_parts.append(f"Human patterns: {', '.join(linguistic_features['human_indicators'][:3])}")
        if linguistic_features.get("ai_indicators"):
            explanation_parts.append(f"AI patterns: {', '.join(linguistic_features['ai_indicators'][:3])}")
        
        if nova_explanation:
            explanation_parts.append(f"Model analysis: {nova_explanation[:100]}")
        
        explanation = " | ".join(explanation_parts) if explanation_parts else "Analysis complete"
        
        # 7. Store in DynamoDB
        item = {
            "id": str(uuid.uuid4()),
            "timestamp": str(int(time.time())),
            "input_text": text[:1000],
            "ai_score": final_score,
            "confidence": confidence,
            "explanation": explanation[:500],
            "linguistic_features": json.dumps(linguistic_features),
            "sentiment": comprehend_results["sentiment"],
            "entities": comprehend_results["entities"][:5],
            "key_phrases": [kp["text"] for kp in comprehend_results["key_phrases"][:5]],
            "text_length": len(text),
            "analysis_version": "enhanced_v2"
        }
        
        try:
            table.put_item(Item=item)
        except Exception as e:
            print(f"[WARN] Failed to write to DynamoDB: {e}")
        
        # 8. Return response
        response_body = {
            "ai_score": final_score,
            "confidence": confidence,
            "explanation": explanation,
            "interpretation": get_interpretation(final_score),
            "details": {
                "linguistic_analysis": {
                    "score": linguistic_score,
                    "human_indicators": linguistic_features.get("human_indicators", []),
                    "ai_indicators": linguistic_features.get("ai_indicators", [])
                },
                "model_analysis": {
                    "score": nova_score,
                    "explanation": nova_explanation[:200]
                },
                "semantic_analysis": {
                    "sentiment": comprehend_results["sentiment"]["primary"],
                    "entities_found": len(comprehend_results["entities"]),
                    "key_phrases": [kp["text"] for kp in comprehend_results["key_phrases"][:3]],
                    "features": comprehend_results["dominant_language_features"]
                }
            },
            "text_length": len(text)
        }
        
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                "Content-Type": "application/json"
            },
            "body": json.dumps(response_body)
        }
        
    except Exception as e:
        print(f"[ERROR] Analysis failed: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "error": "Analysis failed",
                "message": str(e)[:200]
            })
        }


def get_interpretation(score):
    """Provide human-readable interpretation of the score."""
    if score < 20:
        return "Very likely human-written"
    elif score < 40:
        return "Likely human-written"
    elif score < 60:
        return "Uncertain - could be either human or AI"
    elif score < 80:
        return "Likely AI-generated"
    else:
        return "Very likely AI-generated"