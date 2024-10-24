import { useSocket } from "contexts/socket";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Farm, FarmList } from "types/farm";
import { useNavigate } from "react-router-dom";

// Chart.js의 스케일과 플러그인을 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FarmListPage = () => {
  const [farmList, setFarmList] = useState<FarmList>({});
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit("enterFarmList");

    socket.on("farmList", (data: FarmList) => {
      setFarmList(data);
    });

    return () => {
      socket.off("farmList");
      socket.emit("leaveFarmList");
    };
    // 로컬 데이터로 테스트
    // const farmData: FarmData = {
    //   farm1: {
    //     light: 96,
    //     humidity: 36,
    //   },
    //   farm2: {
    //     light: 27,
    //     humidity: 51,
    //   },
    //   farm3: {
    //     light: 92,
    //     humidity: 8,
    //   },
    // };
    // setFarmData(farmData);
  }, [socket]);

  const getChartData = (farm: Farm) => {
    const { light, humidity, temperature, soilMoisture, co2, waterLevel } =
      farm;
    return {
      labels: ["조도", "습도", "온도", "토양수분", "이산화탄소", "수위"],
      datasets: [
        {
          label: "Farm Data",
          data: [light, humidity, temperature, soilMoisture, co2, waterLevel],
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">스마트팜 대시보드</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(farmList).map((farmKey) => (
          <button
            key={farmKey}
            onClick={() => navigate(`/${farmKey}`)}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold mb-4 text-center">
              {farmKey}
            </h3>
            <Line data={getChartData(farmList[farmKey])} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default FarmListPage;
