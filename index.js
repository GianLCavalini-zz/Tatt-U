require("dotenv").config();
const express = require("express");
const cors = require("cors")
require("./config/db.config")();

const app = express();
app.use(express.json());
app.use(cors({ origin:process.env.REACT_APP_URL}))


const userRouter = require("./routes/user.routes");
app.use("/user", userRouter);

const uploadImg = require("./routes/upload.routes");
app.use("/img", uploadImg)

const postRouter = require("./routes/post.routes");
app.use("/post", postRouter);

const messageRouter = require("./routes/message.routes");
app.use("/chat", messageRouter)

app.listen(Number(process.env.PORT), () => {
  console.log("Server up at port: ", process.env.PORT);
});
