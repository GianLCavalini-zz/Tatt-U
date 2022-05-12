require("dotenv").config();
const express = require("express");
require("./config/db.config")();

const app = express();
app.use(express.json());

const userRouter = require("./Routes/user.routes");
app.use("/user", userRouter);

const postRouter = require("./Routes/post.routes");
app.use("/post", postRouter);

const messageRouter = require("./Routes/message.routes");
app.use("/chat", messageRouter)

app.listen(Number(process.env.PORT), () => {
  console.log("Server up at port: ", process.env.PORT);
});
