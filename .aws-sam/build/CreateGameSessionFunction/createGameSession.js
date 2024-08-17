// src/createGameSession.js
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  endpoint: process.env.LOCAL_DYNAMODB_ENDPOINT || undefined,
});
const { v4: uuidv4 } = require("uuid"); // For generating UUIDs

exports.lambdaHandler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received event1:", JSON.stringify(event, null, 2));

  try {
    const requestBody = JSON.parse(event.body);
    const { hostname, players, map, mode } = requestBody;
    console.log("host name is", hostname);

    // if (!hostname || !players || !map || !mode) {
    //   console.error("Invalid request body:", requestBody);
    //   return {
    //     statusCode: 400,
    //     body: JSON.stringify({ message: "Missing required fields" }),
    //   };
    // }
    console.log(
      "Attempting to access resource: ",
      process.env.DYNAMODB_TABLE_NAME
    );

    try {
      console.log("befire dynamoDb");

      const data = await dynamoDb.get(params).promise();
      console.log("Data retrieved: ", data);
    } catch (error) {
      console.error("Error accessing DynamoDB table: ", error);
      throw error; // Re-throw the error after logging it
    }

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        sessionId: uuidv4(),
        hostname,
        players,
        map,
        mode,
      },
    };

    console.log("Before DynamoDB put operation", params);
    await dynamoDB.put(params).promise();
    console.log("After DynamoDB put operation");

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Game session created successfully!" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to create game session",
        error: error.message,
      }),
    };
  }
};
