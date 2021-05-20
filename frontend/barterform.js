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
    const email = document.getElementById("email").value
    const address = document.getElementById("address").value
    const zip = document.getElementById("zip").value

    console.log("FORM DETAILS", username, name, date, comments, email, address, zip)

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
              'email': email,
              'address': address,
              'zip': zip,
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
