const express = require("express");
const cors = require("cors");

// 저장할 농장 데이터 객체
const farmDataStore = {
  farm1: {},
  farm2: {},
  farm3: {},
};

const server = () => {
  const app = express();
  const PORT = process.env.PORT || 5002;
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

    require("./routes/farm")(io, socket, farmDataStore);
  });

  server.listen(PORT, () => {
    console.log("listening on %d", PORT);
  });

  app.get("/", () => {
    res.send("hello world");
  });

  // Polling을 위한 API 엔드포인트
  app.get("/polling/farmList", (req, res) => {
    res.json(farmDataStore);
  });

  app.get("/polling/farms/:farmKey", (req, res) => {
    const { farmKey } = req.params;
    res.json(farmDataStore[farmKey]);
  });

  app.get("/polling/farms/:farmKey/:factorKey", (req, res) => {
    const { farmKey, factorKey } = req.params;
    res.json(farmDataStore[farmKey][factorKey]);
  });
};

server();
