'use client'
import CheckTable from "./components/CheckTable";
import { motion } from "framer-motion";
import {
  columnsData,
} from "./variables/columnsData";
import { VehicleOperation } from "@/library/vehicle";
import { useCallback, useEffect, useState } from "react";
import CustomLoadingElement from "../../components/loading";
import { RouteOperation } from "@/library/route";

const DataTablesPage = () => {
  const [tableData, setTableData] = useState<any>(null)
  const vehice = new VehicleOperation();
  const route = new RouteOperation()

  const handleFetchVehicle = async () => {
    await route.viewAllRoute();
    const response = await vehice.viewAllVehicle();
    console.log(response)
    setTableData(response.data)
  }

  useEffect(() => {
    handleFetchVehicle()
  }, []);

  const reloadData = useCallback(() => {
    handleFetchVehicle();
  }, []);

  return (
    <div className="mt-5 grid min-h-[calc(100vh-126px)] grid-cols-1 gap-5">
      {tableData ? <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CheckTable
          columnsData={columnsData}
          tableData={tableData}
          reloadData={reloadData}
        />
      </motion.div>
        : <CustomLoadingElement />}
    </div>
  );
};

export default DataTablesPage;

