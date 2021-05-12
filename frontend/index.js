
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
