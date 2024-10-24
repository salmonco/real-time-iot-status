const mqtt = require("mqtt");
const mqttClient = mqtt.connect("ws://broker.emqx.io:8083/mqtt");

module.exports = mqttClient;
