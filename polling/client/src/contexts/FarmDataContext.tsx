import { createContext, ReactNode, useContext, useState } from "react";
import { FarmList } from "types/farm";

interface FarmDataContextType {
  farmList: FarmList;
  addFarmFactorData: (farmKey: string, factorKey: string, data: any) => void;
}

const FarmDataContext = createContext<FarmDataContextType>(
  {} as FarmDataContextType
);

export const useFarmData = () => {
  return useContext(FarmDataContext);
};

export const FarmDataProvider = ({ children }: { children: ReactNode }) => {
  const [farmList, setFarmList] = useState<FarmList>({});

  const addFarmFactorData = (
    farmKey: string,
    factorKey: string,
    value: number
  ) => {
    setFarmList((prev) => ({
      ...prev,
      [farmKey]: {
        ...(prev[farmKey] || {}), // 기존 농장 데이터가 없으면 초기화
        [factorKey]: [
          ...(prev[farmKey]?.[factorKey] || []), // 기존 값 배열에 새 데이터 추가
          value,
        ],
      },
    }));
  };

  return (
    <FarmDataContext.Provider value={{ farmList, addFarmFactorData }}>
      {children}
    </FarmDataContext.Provider>
  );
};
