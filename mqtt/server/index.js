const express = require("express");
const cors = require("cors");
const mqttClient = require("./mqttClient");

const server = () => {
  const app = express();
  const PORT = process.env.PORT || 5002;

  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.json());
  app.use(cors());

  //   app.use("/", require("./routes"));

  mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");
    mqttClient.subscribe("enterFarmList");
    mqttClient.subscribe("subscribeFarm/#");
    mqttClient.subscribe("subscribeFactor/#");
    mqttClient.subscribe("leaveFarmList");
    mqttClient.subscribe("unsubscribeFarm/#");
    mqttClient.subscribe("unsubscribeFactor/#");
    mqttClient.subscribe("disconnect");
    require("./routes/farm")(mqttClient);
  });

  mqttClient.on("disconnect", () => {
    console.log("Client disconnected");
  });

  mqttClient.on("message", (topic, message) => {
    console.log(`Received message: ${message.toString()} on topic: ${topic}`);
  });

  app.listen(PORT, () => {
    console.log("listening on %d", PORT);
  });

  app.get("/", () => {
    res.send("hello world");
  });
};

server();
