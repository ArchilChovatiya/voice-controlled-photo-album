import json
import boto3
import requests
import uuid
def lambda_handler(event, context):
    
    #search_string = event['queryStringParameters']['q']
    search_string = event['q']

    lex = boto3.client('lex-runtime', region_name='us-east-1')
    
    lex_res = lex.post_text(
        botName ='photos',
        botAlias ='$LATEST',
        userId = 'user0',
        inputText= search_string
    )
    
    obj1 = lex_res["slots"]["object_one"] 
    obj1 = obj1.lower() if obj1 else ''
    obj2 = lex_res["slots"]["object_two"] 
    obj2 = obj2.lower() if obj2 else ''
    print(obj1,obj2)
    query={
            "size": 20,
            "query": {
                "dis_max":{
                    "queries":    
                    [{
                        "multi_match": {
                        "query": obj1,
                        "fields": ["labels"]
                        }
                    },
                    {
                        "multi_match":{
                        "query": obj2,
                        "fields": ["labels"]
                        }
                    }]
                }
            }
        }
    
    
    openSearchEndpoint = 'https://search-smart-photo-album-ac9137-4urj6wdtjfde7va357525733be.us-east-1.es.amazonaws.com/photo_index/_search' 
    esauth = ('Master', 'Master@123')
    headers = {"Content-Type": "application/json"}
    response = requests.post(openSearchEndpoint,auth=esauth,data=json.dumps(query).encode("utf-8"), headers=headers)
    res=response.json()
    data={}
    if len(res['hits']['hits']) > 0:
        data= res['hits']['hits']
        data = [item['_source'] for item in data] 
        
    response = {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},
        "body": data
        }

    return response