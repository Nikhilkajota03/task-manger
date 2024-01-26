const router = require("express").Router();
const {ScanCommand , PutCommand, DeleteCommand , GetCommand, UpdateCommand} = require("@aws-sdk/lib-dynamodb")
const documentClient = require("./dynamodbClient")
const cuid = require('cuid')



const listTable = "list"
const userTable = "user"


//create
router.post("/addTask", async (req, res) => {



  try {

    const { title, body,date ,  id } = req.body;

    

    const response =  await documentClient.send(new GetCommand({
      TableName: userTable,
      Key: { _id: id },
  })
  )

  console.log(response)

  const user = response.Item && response.Item.length > 0 ? response.Item[0] : null;

  
  const httpStatusCode = response.$metadata.httpStatusCode;

  

   let userid = response.Item._id

   let userlist = response.Item.list;

  //  console.log(userlist)



    if (httpStatusCode===200) {

      const taskid = cuid();

      const userItem = {
        _id:  taskid ,
        title:  title ,
        body:  body ,
        date: date,
        userid: userid
      };

      const response = await documentClient.send(
        new PutCommand({
          TableName: listTable,
          Item: userItem,
        })
      );
  
      console.log(response);

      const httpStatusCode = response.$metadata.httpStatusCode
      
      

    
     if(httpStatusCode!==200){
         return res.status(400).json("not saved");
     }

     const currentList = Array.isArray(userlist) ? userlist : [];
   
     currentList.push(taskid);


     const updateUserResponse = await documentClient.send(new UpdateCommand({
      TableName: userTable,
      Key: { _id: id },
      UpdateExpression: 'SET #list = :list',
      ExpressionAttributeNames: { '#list': 'list' },
      ExpressionAttributeValues: { ':list': currentList },
    }));

    console.log(updateUserResponse);

    return res.status(200).json({ message: "Task added successfully", taskId: taskid }); 

    }


  } catch (error) {
    console.log(error);
  }
});






//update
// router.put("/updateTask/:id", async (req, res) => {
//   try {
//     const { title, body ,date } = req.body;

//     console.log(title , body , date );

//     const list = await List.findByIdAndUpdate(req.params.id, { title, body , date});


//     const listsave = await list.save()

//     if(listsave){
//      return  res.status(200).json({ message: "Task Updated" });
//     }
    


//   } catch (error) {
//     console.log(error);
//   }
// });

router.put("/updateTask/:id", async (req, res) => {
  try {

    const { title, body, date } = req.body;
    const taskId = req.params.id;

    const response = await documentClient.send(
      new UpdateCommand({
           TableName: listTable,
           Key: { _id: taskId },
        UpdateExpression:'SET #title = :title, #body = :body, #date = :date',
        ExpressionAttributeNames: {
          '#title': 'title',
          '#body': 'body',
          '#date': 'date',
        },
        ExpressionAttributeValues: {
          ':title': title,
          ':body': body,
          ':date': date,
        },
      })
   )


   const httpStatusCode = response.$metadata.httpStatusCode;

   if(httpStatusCode!==200){
     return  res.status(400).json("message not saved")
   }

   return  res.status(200).json("update saved")
    
   
  } catch (error) {
    console.log(error);
  }
});








//delete
router.delete("/deleteTask/:id", async (req, res) => {
  try {
    // const { id } = req.body;


    const response =  await documentClient.send(new DeleteCommand({
      TableName: listTable,
      Key: { _id: req.params.id },
  })
  )


  const httpStatusCode = response.$metadata.httpStatusCode;

   if(httpStatusCode!==200){
     return  res.status(400).json("task not deleted")
   }

   return  res.status(200).json("task deleted")
    


  } catch (error) {
    console.log(error);
  }
});








//getTska
router.get("/getTasks/:id", async (req, res) => {
  try {

    console.log(req.params.id)


    const response = await documentClient.send(
      new ScanCommand({
        TableName: listTable,
        FilterExpression: 'userid = :userid',
        ExpressionAttributeValues: {
          ':userid': req.params.id,
        },
      })
    );

  // console.log(response)
  //   console.log(response.Items);

    const httpStatusCode = await response.$metadata.httpStatusCode;

    if (httpStatusCode !== 200) {
      return res.status(400).json("users not found");
    }

    return res.status(200).json({ users: response.Items });


  } catch (error) {
    console.log(error);
  }
});





module.exports = router;
