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
const sendFarmList = (socket, farmDataStore) => {
  const intervalId = setInterval(() => {
    const farmList = {
      farm1: generateFarmData(),
      farm2: generateFarmData(),
      farm3: generateFarmData(),
    };
    console.log("farmList", farmList);
    socket.emit("farmList", farmList);

    // farmDataStore에 저장
    Object.keys(farmList).forEach((farmKey) => {
      farmDataStore[farmKey] = farmList[farmKey];
    });
  }, Math.random() * 2000 + 2000);
  // }, 2000);

  const clearFarmListInterval = () => {
    clearInterval(intervalId);
    console.log(`Stopped sending farmList data`);
  };

  socket.on("leaveFarmList", clearFarmListInterval);
  socket.on("disconnect", clearFarmListInterval);
};

// 개별 농장 데이터 전송
const sendFarmData = (socket, farmKey, farmDataStore) => {
  const intervalId = setInterval(() => {
    const farmData = generateFarmData();
    console.log(`Sending data for ${farmKey}:`, farmData);
    socket.emit(`farmData:${farmKey}`, farmData);

    // farmDataStore에 저장
    farmDataStore[farmKey] = farmData;
  }, 2000);

  const clearFarmInterval = () => {
    clearInterval(intervalId);
    console.log(`Stopped sending data for ${farmKey}`);
  };

  socket.on("unsubscribeFarm", clearFarmInterval);
  socket.on("disconnect", clearFarmInterval);
};

// 개별 농장에 대한 팩터 데이터 전송
const sendFactorData = (socket, farmKey, factorKey, farmDataStore) => {
  const intervalId = setInterval(() => {
    const factorData = generateRandomData();
    console.log(`Sending data for ${factorKey} in ${farmKey}:`, factorData);
    socket.emit(`farmData:${farmKey}:${factorKey}`, factorData);

    farmDataStore[farmKey][factorKey] = factorData;
  }, 2000);

  const clearFactorInterval = () => {
    clearInterval(intervalId);
    console.log(`Stopped sending data for ${factorKey} in ${farmKey}`);
  };

  socket.on("unsubscribeFactor", clearFactorInterval);
  socket.on("disconnect", clearFactorInterval);
};

const eventHandler = (io, socket, farmDataStore) => {
  socket.on("enterFarmList", () => {
    sendFarmList(socket, farmDataStore);
  });

  socket.on("subscribeFarm", (farmKey) => {
    console.log(`subscribeFarm event received for ${farmKey}`);
    sendFarmData(socket, farmKey, farmDataStore);
  });

  socket.on("subscribeFactor", (farmKey, factorKey) => {
    console.log(
      `subscribeFactor event received for ${factorKey} in ${farmKey}`
    );
    sendFactorData(socket, farmKey, factorKey, farmDataStore);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
};

module.exports = eventHandler;
