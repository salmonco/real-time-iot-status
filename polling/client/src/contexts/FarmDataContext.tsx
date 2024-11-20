import { createContext, ReactNode, useContext, useState } from "react";
import { FarmList } from "types/farm";

interface FarmDataContextType {
  farmList: FarmList;
  addFarmData: (farmKey: string, data: any) => void;
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

  const addFarmData = (farmKey: string, data: any) => {
    setFarmList((prev) => ({
      ...prev,
      [farmKey]: {
        ...prev[farmKey],
        ...data,
      },
    }));
  };

  const addFarmFactorData = (farmKey: string, factorKey: string, data: any) => {
    setFarmList((prev) => ({
      ...prev,
      [farmKey]: {
        ...prev[farmKey],
        [factorKey]: {
          ...prev[factorKey],
          ...data,
        },
      },
    }));
  };

  return (
    <FarmDataContext.Provider
      value={{ farmList, addFarmData, addFarmFactorData }}
    >
      {children}
    </FarmDataContext.Provider>
  );
};
