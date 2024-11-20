// type Farm = {
//   light: number;
//   humidity: number;
//   temperature: number;
//   soilMoisture: number;
//   co2: number;
//   waterLevel: number;
// };

type Farm = {
  [key: string]: any;
};

type FarmList = {
  [key: string]: Farm;
};

export type { Farm, FarmList };
