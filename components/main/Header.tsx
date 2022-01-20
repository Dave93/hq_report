import { FC, useState, useEffect } from "react";

import {
  Row,
  Col,
  Breadcrumb,
  Badge,
  Dropdown,
  Button,
  List,
  Avatar,
  Input,
  Drawer,
  Typography,
  Switch,
} from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";

interface Props {
  name: string;
  subName: string;
}

const Header: FC<Props> = ({ name, subName }) => {
  const { Title, Text } = Typography;

  const [visible, setVisible] = useState(false);
  const [sidenavType, setSidenavType] = useState("transparent");
  useEffect(() => window.scrollTo(0, 0));
  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} md={6}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link href="/">Pages</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{name.replace("/", "")}</Breadcrumb.Item>
          </Breadcrumb>
          <div className="ant-page-header-heading">
            <span
              className="ant-page-header-heading-title"
              style={{ textTransform: "capitalize" }}
            >
              {subName.replace("/", "")}
            </span>
          </div>
        </Col>
        <Col span={24} md={18} className="header-control">
          <Button shape="circle" icon={<LogoutOutlined />} />
        </Col>
      </Row>
    </>
  );
};

export default Header;
