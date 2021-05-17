// Function to search for recipes
// ---------------------------------------------------------------------------------------
function searchRecipe(e) {
    e.preventDefault()

    // Clear previous search results
    let node = document.getElementById("photo-grid");
    node.innerHTML = '';

    // Get user's input
    let searchquery = $('#transcript').val();
    console.log("SEARCH QUERY: ", searchquery);

    var params = {q: searchquery};
    var body = {};
    var additionalParams = {};

    searchAPI(params, body, additionalParams);
}


// Search using API /GET method
async function searchAPI(params, body, additionalParams){

    // Connect to API Gateway
    let apigClient = apigClientFactory.newClient();
    console.log("apigClient", apigClient);

    try {
        // API GATEWAY
        const getresponse = await apigClient.searchGet(params, body, additionalParams);

        if (getresponse) {
            console.log("RESPONSE", getresponse)
            let recipes = getresponse.data;
            if (recipes.length === 0){
                let pNode = document.createElement('P');
                let textnode = document.createTextNode("No recipes found.");
                pNode.append(textnode);
                document.getElementById("photo-grid").appendChild(pNode);
                return
            }

            let recipesList = getresponse.data
            // Render recipes
            for (i=0; i<recipesList.length; i++){
                let recipeDetails = recipesList[i][0]
                console.log("RECIPE DETAILS", recipeDetails)
                let pic = document.createElement('img');
                pic.src = recipeDetails.image;
                pic.style.margin = "3px";
                pic.style.height = "70px";
                document.getElementById("photo-grid").appendChild(pic);

                let pNode = document.createElement('P');
                let title = document.createTextNode(recipeDetails.title)
                pNode.append(title);
                document.getElementById("photo-grid").appendChild(pNode)
            }
        }
    } catch (error){
        console.log("Error", error);
    }
}



// Function to add new recipes
// ---------------------------------------------------------------------------------------
function uploadNewRecipe(e){
    e.preventDefault();
    console.log('Uploading new recipe')

    var title = document.getElementById("add-recipe-form").elements[0].value;
    let imageurl = document.getElementById("add-recipe-form").elements[1].value;
    let ingredients = document.getElementById("add-recipe-form").elements[2].value;
    let instructions = document.getElementById("add-recipe-form").elements[3].value;

    console.log("FORM DETAILS", title, imageurl, ingredients, instructions)

    // Get user data from Cognito
    let data = {
        UserPoolId: config.cognito.userPoolId,
        ClientId: config.cognito.clientId
    };
    console.log("DATA", data);

    let CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
    let userPool =  new AmazonCognitoIdentity.CognitoUserPool(data);
    let cognitoUser = userPool.getCurrentUser();

    let username;
    if (cognitoUser) {
        username = cognitoUser.username
    } else {
        username = ''
    }

    console.log("USER POOL", userPool)
    console.log("cognito user", cognitoUser)
    console.log("username", username)


    // Uploading recipe via API /PUT method
    async function uploadRecipePUT() {
        e.preventDefault();
        console.log("Upload button clicked...");

        // Connect to API Gateway
        let apigClient = apigClientFactory.newClient();
        console.log("apigClient", apigClient);

        let params = {
            "Content-Type": "multipart/form-data"
        };
        let body = {
            "username": username,
            "title": title,
            "imageurl": imageurl,
            "ingredients": ingredients,
            "instructions": instructions,
        };
        let additionalParams = {};

        // API GATEWAY
        apigClient.uploadPut(params, body, additionalParams);

        // Clear form after submit
        $("#add-recipe-form")[0].reset();
    }

    uploadRecipePUT()
}
