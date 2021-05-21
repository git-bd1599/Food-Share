let data = {
    UserPoolId: config.cognito.userPoolId,
    ClientId: config.cognito.clientId
}
console.log("DATA", data)
let CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool
let userPool = new AmazonCognitoIdentity.CognitoUserPool(data)
var cognitoUser = userPool.getCurrentUser()
console.log("cognito user", cognitoUser)

if (cognitoUser == null) {
    $('#add-recipe-nav-button').attr('hidden', true)
    $('#recommendations-nav-button').attr('hidden', true)
    $('#bartor-nav-button').attr('hidden', true)
    $('#sign-out-nav-button').attr('hidden', true)
}

function signOut() {
    if (cognitoUser != null) {
        cognitoUser.signOut();
        window.open("login.html", "_self");
    }
}


window.onload = markerDetails

async function markerDetails(params, body, additionalParams) {

    // Connect to API Gateway
    let apigClient = apigClientFactory.newClient();
    console.log("apigClient", apigClient);

    try {
        // API GATEWAY
        const getresponse = await apigClient.rootGet(params, body, additionalParams);

        if (getresponse) {
            console.log("RESPONSE", getresponse)
            let geojson = getresponse.data;
            mapboxgl.accessToken = 'pk.eyJ1IjoiYmVuamk3ODkwIiwiYSI6ImNrb2x2NnF1NDIxNzAydnB3dGlrczF6d24ifQ.U4UVnWoUly_S7eX0ughcKA';
            var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-73.9592492763008,40.722485940954854],
            zoom: 12
          });
            // add markers to map
            geojson.features.forEach(function (marker) {
                // create a HTML element for each feature
                var el = document.createElement('div');
                el.className = 'marker';

                console.log(marker.geometry.coordinates)
                // make a marker for each feature and add it to the map
                new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .setPopup(
                        new mapboxgl.Popup({offset: 25}) // add popups
                            .setHTML(
                                '<h5>' +'</h5><a href="https://dch04u22l9237.cloudfront.net/recipe.html?id=' + marker.properties.recipe_id + '"><h4>' +marker.properties.title +'</h4></a>'
                                + '<img src="'+ marker.properties.image +'" style="width:150px;height:100px;">'
                                // + '<h6> User: '+ marker.properties.user+'</h6>'
                                +'<h6></h6><a href="https://dch04u22l9237.cloudfront.net/barter_form.html?"><h6>Contact '+marker.properties.user +' to barter!</h6></a>'
                            )
                    )
                    .addTo(map);
            });
        }

    } catch (error){
        console.log("Error", error);
    }
}