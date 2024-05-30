"use client"
import React, { useContext, useEffect, useMemo, useState } from "react";
import Card from "@/components/card";
import Checkbox from "@/components/checkbox";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import {
  MdCheckCircle,
  MdAddCircleOutline,
  MdNavigateNext,
  MdNavigateBefore,
  MdOutlineRemoveCircleOutline,
  MdPending,
  MdPendingActions,
} from "react-icons/md";
import Progress from "@/components/progress";
import { Button, useDisclosure } from "@nextui-org/react";
import { IoAddOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import DetailPopup from "./DetailPopup";
import { Address } from "@/library/libraryType/type";
import NotiPopup from "@/components/notification";
import { RouteOperation } from "@/library/route";
import SubmitPopup from "@/components/submit";
import { usePassDataContext } from "@/providers/PassedData";

export interface RouteData {
  begin: Address;
  beginDate: Date;
  carID: string;
  carLicensePlate: string;
  carType: string;
  distance: string;
  driverID: string;
  driverName: string;
  end: Address;
  endDate: Date;
  id: string;
  income: number;
  price: number;
  routeProgress: number;
  status: string;
}

type Props = {
  columnsData: any[];
  tableData: RouteData[];
  reloadData: () => void
};

const CheckTable = (props: Props) => {
  const { columnsData, tableData, reloadData } = props;
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [openModal, setOpenModal] = useState(false);
  const [dataRow, setDataRow] = useState<RouteData | null>(null)
  const [openError, setOpenError] = useState(false);
  const [openError2, setOpenError2] = useState(false);
  const [message, setMessage] = useState("");
  const [openModal2, setOpenModal2] = useState(false);
  const routeOp = new RouteOperation()
  const { passData, setPassData } = usePassDataContext();
  const handleClodeModal = () => {
    setOpenModal(false);
  };
  const [searchValue, setSearchValue] = useState("");
  const toggleRowSelection = (rowIndex: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (selectedRows.has(rowIndex)) {
      newSelectedRows.delete(rowIndex);
    } else {
      newSelectedRows.add(rowIndex);
    }
    setSelectedRows(newSelectedRows);
  };

  const selectAllRows = () => {
    if (selectedRows.size === tableData.length) {
      setSelectedRows(new Set<number>());
    } else {
      const newSelectedRows = new Set<number>();
      tableData.forEach((_, index) => newSelectedRows.add(index));
      setSelectedRows(newSelectedRows);
    }
  };

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const route = useRouter()
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        selectedRowIds: Array.from(selectedRows).reduce((acc: any, val) => {
          acc[val] = true;
          return acc;
        }, {}),
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageIndex },
    setGlobalFilter,
  } = tableInstance;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!openModal) reloadData();
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleFetchData = async () => {
      if (passData && passData != "") {
        const response = await routeOp.GetRoute(passData);
        if (!response.error) {
          setDataRow(response.data);
          setOpenModal(true)
          setPassData("")
        }
      }
    }
    handleFetchData();
  }, [passData]);

  const handleDelete = async () => {
    const selectedIds = Array.from(selectedRows).map(index => tableData[index].id);
    let error = false;
    selectedIds.forEach(async (id) => {
      if (id) {
        const response = await routeOp.deleteRouteByID(id)
        if (response.error) error = true;
      }
    });
    setOpenModal2(false)
    if (error) {
      setMessage("Đã có lỗi xảy ra khi xoá đơn hàng.");
      setOpenError(true);
    } else {
      setMessage("Xoá các đơn hàng đã chọn thành công.");
      setOpenError(true);
      setSelectedRows(new Set())
    }
  };

  return (
    <Card className={"w-full sm:overflow-auto p-4"}>

      {openModal && dataRow && (
        <DetailPopup
          onClose={handleClodeModal}
          dataInitial={dataRow}
          reloadData={reloadData}
        />
      )}
      {openError && <NotiPopup message={message} onClose={() => { setOpenError(false); reloadData() }} />}
      {openError2 && <NotiPopup message={message} onClose={() => { setOpenError2(false) }} />}
      {openModal2 && <SubmitPopup message={message} onClose={() => { setOpenModal2(false); }} submit={handleDelete} />}

      <div className="flex justify-between items-center flex-col lg:flex-row">
        <div className="flex flex-col lg:flex-row gap-3 h-full mb-2 lg:mb-0 w-full place-items-center">
          <div
            className={`relative flex items-center bg-lightPrimary rounded-full text-navy-700 dark:bg-navy-900 dark:text-white lg:w-[300px] w-full`}
          >
            <motion.button
              className={`text-xl h-10 w-8 px-2 ml-2 flex justify-center rounded-full place-items-center`}
              initial={{ left: 2 }}
            >
              <FiSearch
                className={`h-4 w-4 text-[#1488DB]`}
              />
            </motion.button>
            <input
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setGlobalFilter(e.target.value)
              }}
              type="text"
              placeholder="Tìm kiếm..."
              className={`block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-[#1488DB] placeholder:text-[#1488DB]
            outline-none dark:bg-navy-900 dark:text-[#1488DB] pl-1 pr-3`}
            />
          </div>
          <div className="flex gap-2">
            <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-[#1488DB] border 
            border-gray-200 dark:!border-navy-700 hover:bg-gray-100 dark:bg-navy-900 dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-lg font-medium transition duration-200`}
              onClick={() => route.push("/plan")}>
              <MdAddCircleOutline className="mr-1" />Thêm
              <p className={`sm:block ${selectedRows.size != 0 ? "hidden" : "block"}`}>&nbsp;lộ trình</p>
            </Button>
            {selectedRows.size != 0 &&
              <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-[#1488DB] border 
            border-gray-200 dark:!border-navy-700 hover:bg-gray-100 dark:bg-navy-900 dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-lg font-medium transition duration-200`}
                onClick={() => { setMessage("Xác nhận xoá các đơn hàng đã chọn?"); setOpenModal2(true) }}>
                <MdOutlineRemoveCircleOutline className="mr-1" />Xoá đã chọn
              </Button>}
          </div>
        </div>
        <div className="flex gap-2 h-full">
          <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-[#1488DB] border 
            border-gray-200 dark:!border-navy-700 hover:bg-gray-100 dark:bg-navy-900 dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-full font-bold transition duration-200`} onClick={() => previousPage()} disabled={!canPreviousPage}>
            <MdNavigateBefore className="w-6 h-6" />
          </Button>
          <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-[#1488DB] border 
            border-gray-200 dark:!border-navy-700 hover:bg-gray-100 dark:bg-navy-900 dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-full font-bold transition duration-200`} onClick={() => nextPage()} disabled={!canNextPage}>
            <MdNavigateNext className="w-6 h-6" />
          </Button>
        </div>
      </div>
      {tableData.length == 0 ? <div className="h-40 flex w-full place-items-center text-center justify-center">Hiện tại chưa đơn hàng, vui lòng tạo mới.</div>
        : <div className="mt-4 sm:mt-8 overflow-x-auto">
          <table {...getTableProps()} className="w-full" color="gray-500">
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={`border-b border-gray-200 pb-[10px] dark:!border-navy-700`}
                      key={index}
                    >
                      <div className={`text-xs font-bold tracking-wide text-gray-600 lg:text-xs whitespace-nowrap ${column.render("Header") == "Chi tiết" ? "text-end" : "text-start pr-4 lg:pr-0"}`}>
                        {column.render("Header") == "Checkbox" ? <Checkbox checked={selectedRows.size === tableData.length} onChange={() => selectAllRows()} />
                          : column.render("Header")}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, rowIndex) => {
                prepareRow(row);
                const isSelected = selectedRows.has(rowIndex);
                const rowClassName = isSelected
                  ? `dark:bg-navy-900 bg-gray-200 dark:!border-navy-700 border-b`
                  : `dark:!border-navy-700 border-b`;
                return (
                  <tr
                    {...row.getRowProps()}
                    key={rowIndex}
                    className={rowClassName}
                  >
                    {row.cells.map((cell, cellIndex) => {
                      let renderData;
                      if (cell.column.Header === "Checkbox") {
                        renderData = (
                          <Checkbox
                            checked={isSelected}
                            onChange={() => toggleRowSelection(rowIndex)}
                          />
                        );
                      } else if (cell.column.Header === "Tên tài xế") {
                        renderData = (
                          <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white pr-4 whitespace-nowrap">
                            {cell.value}
                          </p>
                        );
                      } else if (cell.column.Header === "Trạng thái") {
                        renderData = (
                          <div className="flex items-center gap-2">
                            <div className={`rounded-full text-xl`}>
                              {cell.value === "Expired" ? (
                                <MdCheckCircle className="text-green-500" />
                              ) : cell.value === "Active" ? (
                                <MdPendingActions className="text-orange-500" />
                              ) : null}
                            </div>
                            <p className="mt-0.5 text-sm font-bold text-navy-700 dark:text-white pr-4 whitespace-nowrap">
                              {cell.value === "Active"
                                ? "Đang hoàn thành" : "Đã hoàn thành"
                              }
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "Biển số xe") {
                        renderData = (
                          <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white pr-4 whitespace-nowrap">
                            {cell.value}
                          </p>
                        );
                      } else if (cell.column.Header === "Tiến độ") {
                        renderData = (
                          <div className="flex place-items-center gap-2">
                            <Progress width="w-[68px]" value={cell.value} />
                            <p className="text-sm font-bold text-navy-700 dark:text-white whitespace-nowrap">
                              {cell.value.toFixed(2)}%
                            </p>
                          </div>
                        );
                      } else if (cell.column.Header === "Khoảng cách (km)") {
                        renderData = (
                          <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white pr-4 whitespace-nowrap">
                            {cell.value}
                          </p>
                        );
                      } else if (cell.column.Header === "Chi tiết") {
                        renderData = (
                          <div className="w-full flex justify-end">
                            <Button
                              onClick={() => {
                                setDataRow(row.original)
                                setOpenModal(true);
                              }}
                              className={`flex items-center hover:cursor-pointer bg-lightPrimary p-2 h-8 w-8 rounded-full text-[#1488DB] border 
                            border-gray-200 dark:!border-navy-700 hover:bg-gray-100 dark:bg-navy-700 dark:hover:bg-white/20 dark:active:bg-white/10
                              linear justify-center font-bold transition duration-200 mr-2`}
                            >
                              <IoAddOutline className="w-full h-full" />
                            </Button>
                          </div>
                        );
                      }
                      return (
                        <td
                          {...cell.getCellProps()}
                          key={cellIndex}
                          className="pt-[14px] pb-[16px] sm:text-[14px]"
                        >
                          {renderData}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>}
    </Card>
  );
};

export default CheckTable;
