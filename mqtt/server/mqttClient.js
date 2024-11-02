const mqtt = require("mqtt");
// const mqttClient = mqtt.connect("ws://broker.emqx.io:8083/mqtt");
const mqttClient = mqtt.connect("ws://localhost:1883");

module.exports = mqttClient;
