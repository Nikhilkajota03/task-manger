const serverless = require("serverless-http");
const express = require("express");
const app = express();
const cors = require("cors");
require("./conn/conn");
const path = require("path");
const auth = require("./routes/auth");
const list = require("./routes/list");
const port = 9000;
app.use(express.json());
app.use(cors())


// app.use(
//   cors({
//     origin: ["https://cobeoh5iu8.execute-api.ap-south-1.amazonaws.com"],
//     method: ["GET", "POST"],
//     credentials: true,
//   })
// );

app.use("/api/v1", auth);
app.use("/api/v2", list);

app.get("/", (req, res) => {

    res.send("on home route")

  // app.use(express.static(path.resolve(__dirname, "frontend", "build")));
  // res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports.handler = serverless(app)


