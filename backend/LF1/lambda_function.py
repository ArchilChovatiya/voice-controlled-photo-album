import json
import urllib.parse
import boto3
import logging
import os
import datetime
import requests

def lambda_handler(event, context):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    s3 = boto3.client('s3')
    region_name = "us-east-1"
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY')
    SECRET_KEY = os.environ.get(' AWS_SECRET_ACCESS_KEY')
    metadata_label, metadata_confidence = [], []
    client = boto3.client('rekognition',
                          aws_access_key_id=ACCESS_KEY,
                          aws_secret_access_key=SECRET_KEY,
                          region_name=region_name)
    
    response = client.detect_labels(Image={'S3Object': {'Bucket': bucket, 'Name': key}})

    for label in response['Labels']:
        metadata_label.append(label['Name'])
        #metadata_confidence.append(format(label['Confidence'], '.2f'))
    
    #data = dict(zip(metadata_label, metadata_confidence))
    
    tresponse = s3.head_object(Bucket=bucket, Key=key) 
    if "x-amz-meta-tags" in tresponse["ResponseMetadata"]["HTTPHeaders"]:
        tags = tresponse["ResponseMetadata"]["HTTPHeaders"]["x-amz-meta-tags"]
        metadata_label.extend(tags.split(","))
        metadata_label=[x.lower() for x in metadata_label]
        metadata_label= list(set(metadata_label))
   
    openSearchEndpoint = 'https://search-smart-photo-album-ac9137-4urj6wdtjfde7va357525733be.us-east-1.es.amazonaws.com/photo_index/_doc/' 
    esauth = ('Master', 'Master@123')
    format = {'objectKey':key,'bucket':bucket,'createdTimestamp':timestamp,'labels':metadata_label}
    headers = {"Content-Type": "application/json"}
    r = requests.post(openSearchEndpoint,auth=esauth,data=json.dumps(format).encode("utf-8"), headers=headers)
    logger.info(r)
    logger.info(metadata_label)
    