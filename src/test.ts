import * as path from "path";

import * as AWS from "aws-sdk"
require('dotenv').config({ path: path.join(__dirname, '../.env') })


AWS.config.update({
    accessKeyId : 'AKIAXUQ22GTROMAPKB5L',
    secretAccessKey : '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',
})


async function quickStart() {
    AWS.config.update({ region : "eu-central-1"})
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName:"session",
        Item:{
            "id": "12345",
            "session_details": "Hello123"
        }
    }
    var get_params = {
        TableName:"session",
        Key:{
            "id": "12345",
        }
    }
    var time = Date.now();
    let result = await docClient.get(
        get_params
    ).promise();
    console.log(result);

    // docClient.put(
    //     params,
    //     function(err, data) {
    //         console.log(Date.now()-time);
    //         if (err) {
    //             console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    //         } else {
    //             console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    //         }
    //     }
    // )
}
quickStart().catch(console.error);