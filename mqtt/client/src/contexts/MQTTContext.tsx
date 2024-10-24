import { createContext, ReactNode, useContext, useEffect } from "react";
import mqtt from "mqtt";

const ENDPOINT = "ws://broker.emqx.io:8083/mqtt";

const mqttClient = mqtt.connect(ENDPOINT);
const mqttClientContext = createContext(mqttClient);

export const useMQTT = () => {
  return useContext(mqttClientContext);
};

export const MQTTProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
    });

    mqttClient.on("reconnect", () => {
      console.log("Reconnecting to MQTT broker...");
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT connection error:", err);
    });

    mqttClient.on("disconnect", () => {
      console.log("Disconnected to MQTT broker");
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  return (
    <mqttClientContext.Provider value={mqttClient}>
      {children}
    </mqttClientContext.Provider>
  );
};
