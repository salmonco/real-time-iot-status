import axios from "axios";
import { useFarmData } from "contexts/farmDataContext";
import { useSocket } from "contexts/socket";
import { FARM_FACTORS } from "libs/constant/farm";
import { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import { Farm } from "types/farm";

const FarmPage = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { farmKey } = useParams<{ farmKey: string }>();
  const { farmList, addFarmFactorData } = useFarmData();
  const MAX_HISTORY_SIZE = 40;

  const fetchFarmData = async () => {
    if (!farmKey) return;

    try {
      const { data } = await axios.get(
        `http://localhost:5002/polling/farms/${farmKey}`
      );

      Object.entries(data).forEach(([factorKey, factorData]) => {
        addFarmFactorData(farmKey, factorKey, factorData);
      });
    } catch (error) {
      console.error("농장 데이터 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    // 특정 농장에 대한 구독 요청
    socket.emit("subscribeFarm", farmKey);

    fetchFarmData(); // 초기 데이터 가져오기
    const interval = setInterval(fetchFarmData, 2000); // 2초마다 데이터 요청

    return () => {
      socket.off(`farmData:${farmKey}`);
      socket.emit("unsubscribeFarm", farmKey);
      clearInterval(interval);
    };
  }, [socket, farmKey]);

  const getChartData = (farm: Farm) => {
    const { light, humidity, temperature, soilMoisture, co2, waterLevel } =
      farm;
    return {
      labels: ["조도", "습도", "온도", "토양수분", "이산화탄소", "수위"],
      datasets: [
        {
          label: `${farmKey}`,
          data: [
            light.at(-1),
            humidity.at(-1),
            temperature.at(-1),
            soilMoisture.at(-1),
            co2.at(-1),
            waterLevel.at(-1),
          ],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(255, 205, 86, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 205, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const getChartFactorData = (label: string, data: number[]) => ({
    labels: Array.from({ length: data.length }, (_, i) => i + 1),
    datasets: [
      {
        label,
        data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const chartOptions = {
    responsive: false,
  };

  const chartStyle = { width: "100%", height: "auto" };

  if (!farmKey) return null;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {farmKey} 대시보드
      </h1>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <Line
          data={getChartData(farmList[farmKey])}
          options={{ maintainAspectRatio: false }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FARM_FACTORS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => navigate(`/${farmKey}/${key}`)}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold mb-4 text-center">{label}</h3>
            <Line
              data={getChartFactorData(
                label,
                farmList[farmKey][key].slice(-MAX_HISTORY_SIZE)
              )}
              options={chartOptions}
              style={chartStyle}
            />
          </button>
        ))}
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
      >
        농장 목록으로 이동
      </button>
    </div>
  );
};

export default FarmPage;
