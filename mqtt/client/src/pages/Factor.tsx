import { useMQTT } from "contexts/MQTTContext";
import { FARM_FACTORS } from "libs/constant/farm";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";

const FactorPage = () => {
  const [history, setHistory] = useState<number[]>([]);
  const navigate = useNavigate();
  const mqttClient = useMQTT();
  const { farmKey, factorKey } = useParams<{
    farmKey: string;
    factorKey: string;
  }>();
  const MAX_HISTORY_SIZE = 40;

  useEffect(() => {
    if (!mqttClient) return;

    // 특정 농장의 특정 팩터에 대한 구독 요청
    mqttClient.publish(`subscribeFactor/${farmKey}/${factorKey}`, "");

    const handleMessage = (topic: string, message: Buffer) => {
      if (topic === `farmData/${farmKey}/${factorKey}`) {
        const data: number = JSON.parse(message.toString());
        console.log(`Received farmData for ${factorKey} in ${farmKey}:`, data); // farmData가 수신되는지 확인
        setHistory((prev) => {
          const updated = [...prev, data];
          return updated.length > MAX_HISTORY_SIZE
            ? updated.slice(-MAX_HISTORY_SIZE)
            : updated;
        });
      }
    };

    mqttClient.subscribe(`farmData/${farmKey}/${factorKey}`);
    mqttClient.on("message", handleMessage);

    return () => {
      mqttClient.off("message", handleMessage);
      mqttClient.publish(`unsubscribeFactor/${farmKey}/${factorKey}`, "");
    };
  }, [mqttClient, farmKey, factorKey]);

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

  if (!factorKey) return null;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {getLabelByKey(factorKey)} 데이터
      </h1>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <Line
          data={getChartFactorData(getLabelByKey(factorKey), history)}
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
