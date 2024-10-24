const express = require("express");
const cors = require("cors");

const server = () => {
  const app = express();
  const PORT = process.env.PORT || 5001;
  const server = require("http").createServer(app);
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.json());
  app.use(cors());

  //   app.use("/", require("./routes"));

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    require("./routes/farm")(io, socket);
  });

  server.listen(PORT, () => {
    console.log("listening on %d", PORT);
  });

  app.get("/", () => {
    res.send("hello world");
  });
};

server();
