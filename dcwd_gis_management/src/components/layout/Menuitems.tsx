import {
  HomeOutlined,
  FileTextOutlined,
  ClusterOutlined,
  SettingOutlined,
  AppstoreOutlined,
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
    key: "home",
    label: "Dashboard",
    icon: <HomeOutlined style={iconSize} />,
    access: ["A00001", "R00001", "A00002", "A00003", "M01"],
  },
  {
    key: "data-maintenance",
    label: "Data Maintenance",
    icon: <FileTextOutlined style={iconSize} />,
    access: ["A00001", "A00002", "R01"],
    children: [
        { key: "dma", label: "District Metering Area" }
    ]
  },
  {
    key: "operations",
    label: "Operations",
    icon: <AppstoreOutlined style={iconSize} />,
    access: ["R00001", "A00003", "A00001"],
  },
  {
    key: "system-maintenance",
    label: "System Maintenance",
    icon: <SettingOutlined style={iconSize} />,
    access: ["A00001", "S01"],
    children: [
      { key: "dispatch-overide", label: "Dispatch Override", access: ["A00001", "S01"] },
      { key: "caretaker-assignment", label: "Caretaker Assignment", access: ["A00001", "S01"] },
      { key: "employees", label: "Employees", access: ["A00001", "S01"] },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    icon: <ClusterOutlined style={iconSize} />,
    access: ["R00001", "A00001"],
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