const router = require("express").Router();
const bcrypt = require("bcryptjs");

const {ScanCommand , PutCommand, DeleteCommand , GetCommand, UpdateCommand,marshallOptions} = require("@aws-sdk/lib-dynamodb")
const documentClient = require("./dynamodbClient")
const cuid = require('cuid')


const TableName = "user"




router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  console.log(email, username, password)

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const _id = cuid();

    const list = [];

    const userItem = {
      _id:  _id ,
      email:  email ,
      username:  username ,
      list: list,
      password:  hashPassword ,
    };

    const response = await documentClient.send(
      new PutCommand({
        TableName: TableName,
        Item: userItem,
      })
    );

    console.log(response);

    return res.status(200).json({ message: "Sign Up Successful" });

  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      return res.status(400).json({ message: "User Already Exists" });
    } else {
      return res.status(400).json({ message: "An error occurred during registration" });
    }
  }
});





router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body)

  try {


    const response = await documentClient.send(
      new ScanCommand({
        TableName: TableName,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
        marshallOptions: {
          removeUndefinedValues: true,
        },
      })
    );

    console.log(response)


    const user = response.Items && response.Items.length > 0 ? response.Items[0] : null;
    console.log(user.password)

    const httpStatusCode = response.$metadata.httpStatusCode;
    console.log(httpStatusCode)
   

    // Check if the user exists
    // const user = response.Item;

    if (httpStatusCode!==200) {
      return res.status(400).json({ message: "User not found. Please Sign Up First" });
    }

    // Compare passwords
    const isPasswordCorrect = bcrypt.compareSync(req.body.password  ,   user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password is not correct" });
    }

    // Omit the password from the response
    const { password, ...others } = user;

    return res.status(200).json({ user: others });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});








module.exports = router;
