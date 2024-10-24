// 랜덤 데이터 생성 함수
const generateRandomData = () => {
  return Math.floor(Math.random() * 100);
};

// 농장 데이터 생성 함수
const generateFarmData = () => {
  return {
    light: generateRandomData(),
    humidity: generateRandomData(),
    temperature: generateRandomData(),
    soilMoisture: generateRandomData(),
    co2: generateRandomData(),
    waterLevel: generateRandomData(),
  };
};

// 농장 리스트 데이터 전송
const sendFarmList = (mqttClient) => {
  const intervalId = setInterval(() => {
    const farmList = {
      farm1: generateFarmData(),
      farm2: generateFarmData(),
      farm3: generateFarmData(),
    };
    console.log("farmList", farmList);
    mqttClient.publish("farmList", JSON.stringify(farmList));
  }, 2000);

  const clearFarmListInterval = () => {
    clearInterval(intervalId);
    console.log(`Stopped sending farmList data`);
  };

  mqttClient.on("message", (topic) => {
    if (topic === "leaveFarmList" || topic === "disconnect") {
      clearFarmListInterval();
    }
  });
};

// 개별 농장 데이터 전송
const sendFarmData = (mqttClient, farmKey) => {
  const intervalId = setInterval(() => {
    const farmData = generateFarmData();
    console.log(`Sending data for ${farmKey}:`, farmData);
    mqttClient.publish(`farmData/${farmKey}`, JSON.stringify(farmData));
  }, 2000);

  const clearFarmInterval = () => {
    clearInterval(intervalId);
    console.log(`Stopped sending data for ${farmKey}`);
  };

  mqttClient.on("message", (topic) => {
    if (topic === `unsubscribeFarm/${farmKey}` || topic === "disconnect") {
      clearFarmInterval();
    }
  });
};

// 개별 농장에 대한 팩터 데이터 전송
const sendFactorData = (mqttClient, farmKey, factorKey) => {
  const intervalId = setInterval(() => {
    const factorData = generateRandomData();
    console.log(`Sending data for ${factorKey} in ${farmKey}:`, factorData);
    mqttClient.publish(
      `farmData/${farmKey}/${factorKey}`,
      JSON.stringify(factorData)
    );
  }, 2000);

  const clearFactorInterval = () => {
    clearInterval(intervalId);
    console.log(`Stopped sending data for ${factorKey} in ${farmKey}`);
  };

  mqttClient.on("message", (topic) => {
    if (
      topic === `unsubscribeFactor/${farmKey}/${factorKey}` ||
      topic === "disconnect"
    ) {
      clearFactorInterval();
    }
  });
};

const eventHandler = (mqttClient) => {
  mqttClient.on("message", (topic, message) => {
    if (topic === "enterFarmList") {
      sendFarmList(mqttClient);
    } else if (topic.startsWith("subscribeFarm/")) {
      const farmKey = topic.split("/")[1];
      console.log(`subscribeFarm event received for ${farmKey}`);
      sendFarmData(mqttClient, farmKey);
    } else if (topic.startsWith("subscribeFactor/")) {
      const [_, farmKey, factorKey] = topic.split("/");
      console.log(
        `subscribeFactor event received for ${factorKey} in ${farmKey}`
      );
      sendFactorData(mqttClient, farmKey, factorKey);
    } else if (topic === "disconnect") {
      console.log("Client disconnected");
    }
  });
};

module.exports = eventHandler;
