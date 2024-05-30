import { FaMapLocationDot } from "react-icons/fa6";
import { FaCar, FaRoad, FaChartPie } from "react-icons/fa";
import { FaPersonBiking } from "react-icons/fa6";

const routes = [
  {
    name: "Báo cáo thống kê",
    layout: "/data",
    path: "/data",
    icon: <FaChartPie className="h-5 w-5 ml-0.5" />,
  },
  {
    name: "Thêm lộ trình",
    layout: "/dashboard",
    icon: <FaMapLocationDot className="h-5 w-5 ml-0.5" />,
    path: "plan",
  },
  {
    name: "Phương tiện",
    layout: "/dashboard",
    path: "vehicle",
    icon: <FaCar className="h-5 w-5 ml-0.5" />,
    secondary: true,
  },
  {
    name: "Tài xế",
    layout: "/dashboard",
    path: "driver",
    icon: <FaPersonBiking className="h-5 w-5 ml-0.5" />,
  },
  {
    name: "Lộ trình",
    layout: "/dashboard",
    icon: <FaRoad className="h-5 w-5 ml-0.5" />,
    path: "route",
  },
];

export default routes;
