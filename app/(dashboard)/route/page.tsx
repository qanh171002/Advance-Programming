'use client'
import { motion } from "framer-motion";
import {
  columnsData,
} from "./variables/columnsData";
import routeData from "./variables/routeData.json";
import CheckTable from "./components/CheckTable";
import { useCallback, useEffect, useState } from "react";
import { RouteOperation } from "@/library/route";
import CustomLoadingElement from "@/app/components/loading";

const DriverManager = () => {
  const [tableData, setTableData] = useState<any>(null)
  const route = new RouteOperation()

  const handleFetchRoute = async () => {
    const response = await route.viewAllRoute();
    const filteredData = response.data.filter((item: any) => item.status !== "Deleted");
    console.log(filteredData)
    setTableData(filteredData);
  }


  useEffect(() => {
    handleFetchRoute()
  }, []);

  const reloadData = useCallback(() => {
    handleFetchRoute();
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

export default DriverManager;