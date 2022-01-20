import { FC } from "react";
import { Layout, Drawer, Affix } from "antd";

const { Header: AntHeader, Content, Sider } = Layout;

const MainLayout: FC = ({ children }) => {
  return <div className="layout">{children}</div>;
};

export default MainLayout;
