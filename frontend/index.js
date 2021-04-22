
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
    let apigClient = apigClientFactory.newClient({apiKey: APIKEY});
    console.log("apigClient", apigClient);

    try {
        // API GATEWAY
        // const getresponse = await apigClient.searchGet(params, body, additionalParams);

        if (getresponse) {
            let recipes = getresponse.data;
            if (recipes.length === 0){
                let pNode = document.createElement('P');
                let textnode = document.createTextNode("No recipes found.");
                pNode.append(textnode);
                document.getElementById("photo-grid").appendChild(pNode);
                return
            }

            // Render recipe images
            for (i=0; i<pictures.length; i++){
                let pic = document.createElement('img');
                // pic.src = "https://s3.amazonaws.com/b2-photo-storage/" + pictures[i]; # ADD SOURCE
                pic.style.margin = "3px";
                pic.style.height = "200px";
                document.getElementById("photo-grid").appendChild(pic);
            }
        }
    } catch (error){
        console.log("Error", error);
    }
}
