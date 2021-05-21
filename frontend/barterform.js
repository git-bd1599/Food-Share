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

// //insert pool id of your congito pool
// const IdentityPoolId = 'us-east-1:561ca273-9c58-4922-91f0-ba746a6023b4;'
// const credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId })
// //insert your region
// const region = 'us-east-1';
// AWS.config.update({
//   region,
//   credentials
// });
// const ddb = new AWS.DynamoDB({
//   apiVersion: '2012-10-08'
// });

// Function to add new recipes
// ---------------------------------------------------------------------------------------
function addBarter(e){
    e.preventDefault();
    console.log('Add New Barter')

    const recipe = document.getElementById("recipe").value
    const username = document.getElementById("username").value
    const date = document.getElementById("date").value
    const comments = document.getElementById("comments").value
    const phone = document.getElementById("phone").value
    const address = document.getElementById("address").value
    const city = document.getElementById("city").value

    console.log("FORM DETAILS", username, name, date, comments, phone, address, city)

    // Uploading recipe via API /PUT method
    async function addBarterPUT() {
        e.preventDefault();
        console.log("Submit clicked...");

        // Connect to API Gateway
        let apigClient = apigClientFactory.newClient();
        console.log("apigClient", apigClient);

        let params = {
            "Content-Type": "multipart/form-data"
        };
        let body = {
              'recipe_id': recipe,
              'username': username,
              'date': date,
              'comments': comments,
              'phone': phone,
              'address': address,
              'city': city,
        };
        let additionalParams = {};

        // API GATEWAY
        apigClient.uploadPut(params, body, additionalParams);

        document.getElementById('barter-form').reset()
        alert('Barter Form has been submitted!')
        // document.location.href="barter.html"
    }

    addBarterPUT()
}


//
// const barterTable = 'barter';
//
// //insert pool id of your congito pool
// const IdentityPoolId = 'us-east-1:561ca273-9c58-4922-91f0-ba746a6023b4';
// const credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId });
// //insert your region
// const region = 'us-east-1';
//
// AWS.config.update({
//   region,
//   credentials
// });
//
// const ddb = new AWS.DynamoDB({
//   apiVersion: '2012-10-08'
// });
//
// function addBarter() {
//   const username = document.getElementById("username").value
//   const name = document.getElementById("name").value
//   const date = document.getElementById("date").value
//   const comments = document.getElementById("comments").value
//   const phone = document.getElementById("phone").value
//   const email = document.getElementById("email").value
//   const address = document.getElementById("address").value
//   const zip = document.getElementById("zip").value
//   const params = {
//     "RequestItems": {
//       "barter": [
//         {
//           "PutRequest": {
//             "Item": {
//               'username': {"S": username},
//               'name': {"S": name},
//               'date': {"S": date},
//               'comments': {"S": comments},
//               'phone': {"S": phone},
//               'email': {"S": email},
//               'address': {"S": address},
//               'zip': {"S": zip},
//               // 'createdAt': {"N": Date.now().toString()}
//             }
//           }
//         }
//       ]
//     }
//   }
//   ddb.batchWriteItem(params, function(err, data) {
//     if (err) {
//       return alert('Error: ' + err.message);
//     } else {
//       document.getElementById('barter-form').reset()
//     }
//   })
// }
