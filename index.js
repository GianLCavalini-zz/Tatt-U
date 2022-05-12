require("dotenv").config();
const express = require("express");
require("./config/db.config")();

const app = express();
app.use(express.json());

//const userRouter = require("./Routes/user.routes");
//app.use("/user", userRouter)



app.listen(Number(process.env.PORT), () => {
  console.log("Server up at port: ", process.env.PORT);
});
