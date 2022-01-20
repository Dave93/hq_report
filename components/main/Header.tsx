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

interface Props {
  name: string;
  subName: string;
}

const Header: FC<Props> = ({ name, subName }) => {
  return (
    <div className="header">
      <h1>Header</h1>
    </div>
  );
};

export default Header;
