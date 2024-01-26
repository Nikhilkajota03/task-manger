const {DynamoDBClient} = require('@aws-sdk/client-dynamodb')
const {DynamoDBDocumentClient} = require ('@aws-sdk/lib-dynamodb')

const dbClient = new DynamoDBClient({
     region: "ap-south-1",
     credentials:{
        accessKeyId:"AKIAQT2PZ2X2H35KWXNZ",
        secretAccessKey:"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"
     },
})


const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: false, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
  };
  
  const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
  };
  
  const translateConfig = { marshallOptions, unmarshallOptions };

  const documentClient = DynamoDBDocumentClient.from(dbClient, translateConfig)

  module.exports = documentClient;