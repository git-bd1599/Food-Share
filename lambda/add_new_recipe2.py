import json
import boto3
import time
from elasticsearch import Elasticsearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth

REGION = 'us-east-1'
RECIPES_TABLE = 'recipes'
USERS_TABLE = 'Users'

es_endpoint = 'search-recipes-2i7rrbbths6vftpgij7o44u7mu.us-east-1.es.amazonaws.com'
credentials = boto3.Session().get_credentials()
service = 'es'
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, REGION, service, session_token=credentials.token)

def lambda_handler(event, context):
    print("EVENT", event)
    body = event['body']
    print("BODY", body)

    # convert string back to dict
    body_dict = json.loads(body)

    username = body_dict['username']
    print('USERNAME', username)

    # new unique id so it doesn't overlap with spoonacular
    recipe_id = username + str(int(time.time()))
    print('recipe id', recipe_id)

    # list of ingredients
    ingredients = body_dict['ingredients'].split(',')

    # Put new recipe in recipes table
    dynamodb = boto3.resource('dynamodb')
    recipesTable = dynamodb.Table(RECIPES_TABLE)
    usersTable = dynamodb.Table(USERS_TABLE)

    recipesTable.put_item(
        Item={
            'id': recipe_id,
            'title': body_dict['title'],
            'ingredients': ingredients,
            'instructions': body_dict['instructions'],
            'image': body_dict['imageurl']
        }
    )


    # Add recipe to elasticsearch
    es = Elasticsearch(
        hosts = [{'host': es_endpoint, 'port': 443}],
        http_auth = awsauth,
        use_ssl = True,
        verify_certs = True,
        connection_class = RequestsHttpConnection
    )

    labels = []

    newTitle = ""
    for char in body_dict['title']:
        if char.isalnum() or char == ' ':
            newTitle += char
    labels += newTitle.split()

    for ingredientDetails in ingredients:
        words = ingredientDetails.split()
        labels.append(words[-1]) # add only the main ingredient to label

    finalLabels = []
    dontInclude = ['and', 'with']
    for label in labels:
        if len(label) > 1 and label not in dontInclude: # only words longer than 1 alphabet
            finalLabels.append(label.lower())

    print("FINAL LABELS", finalLabels)

    # index_data = {
    #     'id': recipe['id'],
    #     'labels': finalLabels
    # }

    # print("DEBUG index_data:", index_data)

    # es.index(index="recipes", id=recipe['id'], body=index_data, refresh=True, request_timeout=30)



    return {
        "statusCode": 200,
        'headers': {"Access-Control-Allow-Origin": "*"},
        "body": ""
    }
