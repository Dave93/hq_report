import { FC, useState } from "react";
import { Layout, Drawer, Affix } from "antd";
import Sidenav from "@components/Sidenav";
import Header from "./Header";
import Footer from "./Footer";

const { Header: AntHeader, Content, Sider } = Layout;

const MainLayout: FC = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [sidenavColor, setSidenavColor] = useState("#1890ff");
  const [sidenavType, setSidenavType] = useState("transparent");
  const [fixed, setFixed] = useState(false);

  const openDrawer = () => setVisible(!visible);
  return (
    <Layout className={`layout-dashboard`}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        trigger={null}
        width={250}
        theme="light"
        className={`sider-primary ant-layout-sider-primary ${
          sidenavType === "#fff" ? "active-route" : ""
        }`}
        style={{ background: sidenavType }}
      >
        <Sidenav />
      </Sider>
      <Layout>
        <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
          <Header name={"dashboard"} subName={"dashboard"} />
        </AntHeader>
        <Content className="content-ant">{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
