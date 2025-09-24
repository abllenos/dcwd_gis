import {
  AppstoreOutlined,
  BookOutlined,
  BoxPlotOutlined,
  FileTextOutlined,
  ClusterOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

export interface CustomMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  access?: string[];
  children?: CustomMenuItem[];
}

const iconSize = { fontSize: "18px" };

export const menuItems: CustomMenuItem[] = [
  {
    key: "data-maintenance",
    label: "Data Maintenance",
    icon: <FileTextOutlined style={iconSize} />,
    access: ["A00001", "A00002", "R01"],
    children: [
      { key: "assets", label: "Assets", access: ["A00001", "A00002"] },
      { key: "district-metering-area", label: "District Metering Area", access: ["A00001", "A00002"] },
      { key: "map-viewer", label: "Map Viewer", access: ["A00001", "A00002"] },
      { key: "valve", label: "Valve", access: ["A00001", "A00002"] },
      { key: "air-valve", label: "Air Valve", access: ["A00001", "A00002"] },
      { key: "fire-hydrant", label: "Fire Hydrant", access: ["A00001", "A00002"] },
      { key: "isolation-valve", label: "Isolation Valve", access: ["A00001", "A00002"] },
      { key: "pressure-setting-valve", label: "Pressure Setting Valve", access: ["A00001", "A00002"] },
      { key: "pressure-release-valve", label: "Pressure Release Valve", access: ["A00001", "A00002"] },
      { key: "blow-off-valve", label: "Blow Off Valve", access: ["A00001", "A00002"] },
      { key: "pressure-monitoring-system", label: "Pressure Monitoring System", access: ["A00001", "A00002"] },
      { key: "pipe-network", label: "Pipe Network", access: ["A00001", "A00002"] },
      { key: "distribution-transmission", label: "Distribution & Transmission", access: ["A00001", "A00002"] },
      { key: "district-metering-area-2", label: "District Metering Area", access: ["A00001", "A00002"] },
      { key: "dma-inlet", label: "DMA Inlet", access: ["A00001", "A00002"] },
    ]
  },
  {
    key: "gis-operation",
    label: "GIS Operation",
    icon: <BoxPlotOutlined style={iconSize} />,
    access: ["A00001", "A00002", "R00001"],
    children: [
      { key: "mapinfo-users", label: "MapInfo Users", access: ["A00001", "A00002"] },
      { key: "building-footprints", label: "Building Footprints", access: ["A00001", "A00002"] },
    ]
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: <AppstoreOutlined style={iconSize} />,
    access: ["A00001", "A00002", "R00001"],
    children: [
      { key: "license", label: "License", access: ["A00001", "A00002"] },
      { key: "vts", label: "VTS", access: ["A00001", "A00002"] },
    ]
  },
  {
    key: "report",
    label: "Report",
    icon: <ClusterOutlined style={iconSize} />,
    access: ["R00001", "A00001", "A00002"],
  },
  {
    key: "log",
    label: "Log",
    icon: <BookOutlined style={iconSize} />,
    access: ["A00001", "S01"],
  },
  {
    key: "maintenance",
    label: "Maintenance",
    icon: <ToolOutlined style={iconSize} />,
    access: ["A00001", "S01"],
    children: [
      { key: "classification", label: "Classification", access: ["A00001", "S01"] },
      { key: "class", label: "Class", access: ["A00001", "S01"] },
      { key: "layer", label: "Layer", access: ["A00001", "S01"] },
      { key: "settings", label: "Settings", access: ["A00001", "S01"] },
      { key: "user-accounts", label: "User Accounts", access: ["A00001", "S01"] },
    ]
  },
];

export const getSidebarWidth = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1600) return Math.min(screenWidth * 0.2, 300);
  if (screenWidth >= 1200) return Math.min(screenWidth * 0.22, 285);
  return 280;
};

export const filterMenuByAccess = (
  items: CustomMenuItem[],
  userAccess: string[]
): MenuProps["items"] => {
  return items
    .filter((item) => {
      if (!item?.access) return true;
      return item.access.some((a: string) => userAccess.includes(a));
    })
    .map((item) => {
      const children = item?.children
        ? filterMenuByAccess(item.children, userAccess)
        : undefined;

        if (children && children.length === 0) return null;

        const { access, ...rest } = item;
        
        return { ...rest, children};
    })
    .filter(Boolean) as MenuProps["items"];
};