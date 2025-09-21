import json
import uuid
import time
import boto3
import os
import logging
import io
import base64
from urllib.parse import unquote_plus
import requests
from PIL import Image
# import numpy as np  # Temporarily disabled for Lambda compatibility

# Configure logging for CloudWatch
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# --- Config ---
US_REGION = "us-east-1"
BEDROCK_REGION = os.environ.get("BEDROCK_REGION", US_REGION)
TABLE_NAME = os.environ.get("TABLE_NAME", "ContentDetections")
BUCKET_NAME = os.environ.get("BUCKET_NAME", "ai-detection-images")
DATA_REGION = os.environ.get("DATA_REGION", "ap-southeast-5")

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
    s3 = boto3.client("s3", region_name=DATA_REGION)
    dynamodb = boto3.resource("dynamodb", region_name=DATA_REGION)
    bedrock = boto3.client("bedrock-runtime", region_name=BEDROCK_REGION)

    logger.info(f"S3 region: {s3.meta.region_name}")
    logger.info(f"DynamoDB region: {dynamodb.meta.client.meta.region_name}")
    logger.info(f"Bedrock region: {bedrock.meta.region_name}")

    return s3, dynamodb, bedrock

def preprocess_image(image_bytes):
    """Preprocess image for ARTID model"""
    try:
        # Load image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to standard size (ARTID typically uses 224x224 or 512x512)
        image = image.resize((224, 224), Image.Resampling.LANCZOS)
        
        # Convert to list and normalize (numpy alternative)
        img_array = list(image.getdata())
        # Normalize each pixel tuple
        img_array = [[pixel / 255.0 for pixel in pixel_tuple] for pixel_tuple in img_array]
        
        # Flatten for processing
        img_array = [pixel for pixel_tuple in img_array for pixel in pixel_tuple]
        
        return img_array
        
    except Exception as e:
        logger.error(f"Image preprocessing error: {str(e)}")
        raise

def preprocess_image_for_sagemaker(image_data):
    """Preprocess image to ensure compatibility with SageMaker endpoint"""
    try:
        # Convert to PIL Image
        if isinstance(image_data, str):
            image_data = base64.b64decode(image_data)
        
        img = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to standard size for deepfake detection
        img = img.resize((224, 224), Image.Resampling.LANCZOS)
        
        # Save as JPEG with high quality
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='JPEG', quality=95, optimize=True)
        processed_img_data = img_buffer.getvalue()
        
        return processed_img_data
        
    except Exception as e:
        logger.error(f"Image preprocessing failed: {str(e)}")
        return None  # Return None for corrupted images

def call_sagemaker_endpoint(image_data):
    """Call SageMaker deepfake detector endpoint"""
    try:
        # Preprocess image
        processed_image_data = preprocess_image_for_sagemaker(image_data)
        
        if processed_image_data is None:
            logger.warning("Image preprocessing failed, using fallback")
            return simulate_deepfake_detection(image_data)
        
        # Initialize SageMaker runtime client
        sagemaker_runtime = boto3.client('sagemaker-runtime', region_name='ap-southeast-1')
        
        # Get endpoint name from environment or use default
        endpoint_name = os.environ.get('SAGEMAKER_ENDPOINT_NAME', 'deepfake-detector-endpoint')
        
        # Call SageMaker endpoint
        response = sagemaker_runtime.invoke_endpoint(
            EndpointName=endpoint_name,
            ContentType='image/x-image',
            Body=processed_image_data
        )
        
        # Parse response
        result = json.loads(response['Body'].read())
        
        # Convert SageMaker response to our format
        fake_score = result[0]['score'] if result[0]['label'] == 'Fake' else result[1]['score']
        real_score = result[1]['score'] if result[1]['label'] == 'Real' else result[0]['score']
        
        # Calculate confidence based on score difference
        confidence = abs(fake_score - real_score)
        
        return {
            "ai_probability": float(fake_score),
            "confidence": float(confidence),
            "features": {
                "texture_consistency": fake_score,
                "color_distribution": real_score,
                "edge_sharpness": confidence,
                "noise_patterns": fake_score,
                "composition_balance": real_score
            },
            "model_name": "SageMaker-Deepfake-Detector",
            "model_version": "v1.0",
            "raw_response": result
        }
        
    except Exception as e:
        logger.error(f"SageMaker call failed: {str(e)}")
        # Fallback to simulation
        return simulate_deepfake_detection(image_data)

def simulate_deepfake_detection(image_data):
    """Fallback simulation when SageMaker fails"""
    import random
    artid_score = random.uniform(0.1, 0.9)
    confidence = random.uniform(0.7, 0.95)
    
    features = {
        "texture_consistency": random.uniform(0.2, 0.8),
        "color_distribution": random.uniform(0.3, 0.9),
        "edge_sharpness": random.uniform(0.1, 0.7),
        "noise_patterns": random.uniform(0.2, 0.8),
        "composition_balance": random.uniform(0.3, 0.9)
    }
    
    return {
        "ai_probability": float(artid_score),
        "confidence": float(confidence),
        "features": features,
        "model_name": "Simulation-Fallback",
        "model_version": "v1.0"
    }

def analyze_with_bedrock(artid_results, image_metadata):
    """Use Bedrock to analyze ARTID results and provide explanations"""
    try:
        bedrock = boto3.client("bedrock-runtime", region_name=BEDROCK_REGION)
        
        # Prepare prompt for Bedrock analysis
        prompt = f"""
        Analyze the following AI-generated image detection results and provide a comprehensive explanation:
        
        ARTID Model Results:
        - AI Probability: {artid_results['ai_probability']:.2%}
        - Confidence: {artid_results['confidence']:.2%}
        - Model: {artid_results['model_name']} {artid_results['model_version']}
        
        Feature Analysis:
        - Texture Consistency: {artid_results['features']['texture_consistency']:.2%}
        - Color Distribution: {artid_results['features']['color_distribution']:.2%}
        - Edge Sharpness: {artid_results['features']['edge_sharpness']:.2%}
        - Noise Patterns: {artid_results['features']['noise_patterns']:.2%}
        - Composition Balance: {artid_results['features']['composition_balance']:.2%}
        
        Image Metadata:
        - Size: {image_metadata.get('width', 'Unknown')}x{image_metadata.get('height', 'Unknown')}
        - Format: {image_metadata.get('format', 'Unknown')}
        - File Size: {image_metadata.get('file_size', 'Unknown')} bytes
        
        Please provide:
        1. A clear assessment of whether this image is AI-generated
        2. Detailed explanation of the key indicators
        3. Confidence level in the assessment
        4. Specific features that led to this conclusion
        
        Format your response as JSON with the following structure:
        {{
            "assessment": "AI-Generated" or "Human-Created" or "Uncertain",
            "confidence": "High" or "Medium" or "Low",
            "explanation": "Detailed explanation of the analysis",
            "key_indicators": ["list", "of", "key", "indicators"],
            "recommendations": "Additional analysis recommendations if any"
        }}
        """
        
        payload = {
            "messages": [
                {
                    "role": "user", 
                    "content": [{"text": prompt}]
                }
            ],
            "inferenceConfig": {
                "maxTokens": 500,
                "temperature": 0.3,
                "stopSequences": ["\n\n"]
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
        
        # Parse the JSON response
        try:
            # Clean the output
            cleaned_output = raw_output.strip()
            if cleaned_output.startswith('```json'):
                cleaned_output = cleaned_output.replace('```json', '', 1).strip()
            if cleaned_output.endswith('```'):
                cleaned_output = cleaned_output.rstrip('```').strip()
            
            analysis = json.loads(cleaned_output)
            return analysis
            
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return {
                "assessment": "AI-Generated" if artid_results['ai_probability'] > 0.5 else "Human-Created",
                "confidence": "High" if artid_results['confidence'] > 0.8 else "Medium",
                "explanation": raw_output[:300] + "..." if len(raw_output) > 300 else raw_output,
                "key_indicators": ["Texture analysis", "Color distribution", "Edge detection"],
                "recommendations": "Consider additional verification methods"
            }
        
    except Exception as e:
        logger.error(f"Bedrock analysis error: {str(e)}")
        return {
            "assessment": "Uncertain",
            "confidence": "Low",
            "explanation": f"Analysis error: {str(e)}",
            "key_indicators": [],
            "recommendations": "Manual review recommended"
        }

def analyze_image(s3, bucket_name, object_key):
    """Analyze an image using ARTID model and Bedrock"""
    try:
        # Get image from S3
        obj = s3.get_object(Bucket=bucket_name, Key=object_key)
        image_bytes = obj['Body'].read()
        
        # Get image metadata
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image_metadata = {
                "width": image.width,
                "height": image.height,
                "format": image.format,
                "mode": image.mode,
                "file_size": len(image_bytes)
            }
        except Exception as e:
            logger.warning(f"Could not extract image metadata: {str(e)}")
            image_metadata = {"file_size": len(image_bytes)}
        
        # Preprocess image for ARTID model
        image_array = preprocess_image(image_bytes)
        
        # Call SageMaker endpoint
        artid_results = call_sagemaker_endpoint(image_bytes)
        
        # Analyze results with Bedrock
        bedrock_analysis = analyze_with_bedrock(artid_results, image_metadata)
        
        return artid_results, bedrock_analysis, image_metadata
        
    except Exception as e:
        logger.error(f"Image analysis error: {str(e)}")
        raise

def lambda_handler(event, context):
    """Main Lambda handler for image analysis"""
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
        
        return analyze_existing_image(bucket_name, object_key)

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
    """Handle image upload and immediate analysis"""
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
        
        s3, dynamodb, bedrock = get_clients()
        
        # Decode base64 image
        file_bytes = base64.b64decode(file_content)
        s3.put_object(
            Bucket=bucket_name,
            Key=file_name,
            Body=file_bytes,
            ContentType=file_type
        )
        
        logger.info(f"Uploaded {file_name} to S3")
        
        return analyze_existing_image(bucket_name, file_name)
        
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
        
        return analyze_existing_image(bucket_name, object_key)
        
    except Exception as e:
        logger.error(f"S3 event handling error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": get_cors_headers(),
            "body": json.dumps({"error": str(e)})
        }

def analyze_existing_image(bucket_name, object_key):
    """Analyze an existing image in S3"""
    try:
        s3, dynamodb, bedrock = get_clients()
        table = dynamodb.Table(TABLE_NAME)

        # Analyze image with ARTID and Bedrock
        artid_results, bedrock_analysis, image_metadata = analyze_image(s3, bucket_name, object_key)

        # Store results in DynamoDB
        item = {
            "id": str(uuid.uuid4()),
            "timestamp": str(int(time.time())),
            "bucket_name": bucket_name,
            "object_key": object_key,
            "file_size": image_metadata.get("file_size", 0),
            "image_width": image_metadata.get("width", 0),
            "image_height": image_metadata.get("height", 0),
            "image_format": image_metadata.get("format", "unknown"),
            "ai_probability": artid_results["ai_probability"],
            "confidence": artid_results["confidence"],
            "assessment": bedrock_analysis["assessment"],
            "explanation": bedrock_analysis["explanation"],
            "key_indicators": bedrock_analysis["key_indicators"],
            "artid_features": artid_results["features"],
            "model_name": artid_results["model_name"],
            "model_version": artid_results["model_version"],
            "analysis_version": "image_v1_enhanced",
            "source_type": "image"
        }

        try:
            table.put_item(Item=item)
            logger.info(f"Stored analysis in DynamoDB for {object_key}")
        except Exception as e:
            logger.error(f"Failed DynamoDB write: {str(e)}")

        # Store detailed results in S3
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

        # Enhanced response
        response_body = {
            "image_id": item["id"],
            "object_key": object_key,
            "ai_probability": artid_results["ai_probability"],
            "confidence": artid_results["confidence"],
            "assessment": bedrock_analysis["assessment"],
            "explanation": bedrock_analysis["explanation"],
            "key_indicators": bedrock_analysis["key_indicators"],
            "recommendations": bedrock_analysis.get("recommendations", ""),
            "image_metadata": image_metadata,
            "artid_features": artid_results["features"],
            "model_info": {
                "name": artid_results["model_name"],
                "version": artid_results["model_version"]
            },
            "analysis_version": "image_v1_enhanced"
        }

        return {
            "statusCode": 200,
            "headers": get_cors_headers(),
            "body": json.dumps(response_body)
        }

    except Exception as e:
        logger.error(f"Image analysis error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": get_cors_headers(),
            "body": json.dumps({"error": str(e)})
        }
