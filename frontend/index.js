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

                let currId = recipeDetails.id
                let currImage = recipeDetails.image
                let currTitle = recipeDetails.title

                let currAnchor = "http://search-exchange-recipes.s3-website-us-east-1.amazonaws.com/recipe.html?id=" + currId
                // let currAnchor = "https://dch04u22l9237.cloudfront.net/recipe.html?id=" + currId

                $('#photo-grid').append('<img src="' + currImage + '" style="margin: 3px; height: 70px;"><p><a href="' + currAnchor + '">' + currTitle + '</a></p>')
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
