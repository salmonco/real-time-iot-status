import axios from "axios";
import { useFarmData } from "contexts/farmDataContext";
import { useSocket } from "contexts/socket";
import { FARM_FACTORS } from "libs/constant/farm";
import { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";

const FactorPage = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { farmKey, factorKey } = useParams<{
    farmKey: string;
    factorKey: string;
  }>();
  const { farmList, addFarmFactorData } = useFarmData();
  const MAX_HISTORY_SIZE = 40;

  const fetchFarmData = async () => {
    if (!farmKey || !factorKey) return;

    try {
      const { data } = await axios.get(
        `http://localhost:5002/polling/farms/${farmKey}/${factorKey}`
      );

      addFarmFactorData(farmKey, factorKey, data);
    } catch (error) {
      console.error("농장 데이터 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    // 특정 농장의 특정 팩터에 대한 구독 요청
    socket.emit("subscribeFactor", farmKey, factorKey);

    fetchFarmData(); // 초기 데이터 가져오기
    const interval = setInterval(fetchFarmData, 2000); // 2초마다 데이터 요청

    return () => {
      socket.off(`farmData:${farmKey}:${factorKey}`);
      socket.emit("unsubscribeFactor", farmKey, factorKey);
      clearInterval(interval);
    };
  }, [socket, farmKey, factorKey]);

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

  const getLabelByKey = (key: string) => {
    const factor = FARM_FACTORS.find((factor) => factor.key === key);
    return factor ? factor.label : "";
  };

  if (!farmKey || !factorKey) return null;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {getLabelByKey(factorKey)} 데이터
      </h1>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <Line
          data={getChartFactorData(
            getLabelByKey(factorKey),
            farmList[farmKey][factorKey].slice(-MAX_HISTORY_SIZE)
          )}
          options={{ maintainAspectRatio: false }}
        />
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
      >
        농장으로 이동
      </button>
    </div>
  );
};

export default FactorPage;
