import json
import boto3
from boto3.dynamodb.conditions import Key


CAMPAIGN_ARN = 'arn:aws:personalize:us-east-1:522843601067:campaign/campaign2again'
TABLE_NAME = 'recipes'

personalizeRt = boto3.client('personalize-runtime')


# Get recommendations for a given user
def recommendations_for(username):
    response = personalizeRt.get_recommendations(
        campaignArn = CAMPAIGN_ARN,
        userId = username,
        numResults = 5
    )

    recommended_recipes = []
    for item in response['itemList']:
        recommended_recipes.append(item['itemId'])

    return recommended_recipes
    # https://docs.aws.amazon.com/personalize/latest/dg/getting-real-time-recommendations.html#recommendations


# Query DynamoDB to get recipe details
def query_database(recipe_id):
    dynamodb = boto3.resource('dynamodb')
    dynamoTable = dynamodb.Table(TABLE_NAME)
    response = dynamoTable.query(
        KeyConditionExpression=Key('id').eq(recipe_id)
    )
    return response['Items']
    # https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.Python.04.html


def lambda_handler(event, context):

    bob = recommendations_for('bob')
    alice = recommendations_for('alice')
    testuser = recommendations_for('testuser')

    print("RECOMMENDATIONS BOB ---> ", bob)
    print("RECOMMENDATIONS ALICE ---> ", alice)
    print("RECOMMENDATIONS TESTUSER ---> ", testuser)




    recipe_details = []
    for recipe_id in alice: # FIX *******
        print("RECIPE ID", recipe_id)
        recipe_details.append(query_database(recipe_id))

    print("RECIPE DETAILS ---> ", recipe_details)


    return {
        "statusCode": 200,
        'headers': {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps(recipe_details)
    }
