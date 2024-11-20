import FactorPage from "@pages/Factor";
import FarmPage from "@pages/Farm";
import FarmListPage from "@pages/FarmList";
import { Route, Routes } from "react-router-dom";

export const Router = () => {
  return (
    <Routes>
      <Route path={"/"} element={<FarmListPage />} />
      <Route path={"/:farmKey"}>
        <Route path={""} element={<FarmPage />} />
        <Route path={":factorKey"} element={<FactorPage />} />
      </Route>
    </Routes>
  );
};
