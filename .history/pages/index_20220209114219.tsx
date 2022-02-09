import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useSession, signIn, signOut, getSession } from "next-auth/react";
import MainLayout from "@components/ui/MainLayout";
import {
  Alert,
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  Table,
  Tabs,
  Tooltip,
  Upload,
} from "antd";
import getConfig from "next/config";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { create, fetchAll, getAllRoles, updateById } from "@libs/users/index";
import { fetchAll as fetchTerminals } from "@libs/terminals/index";
import { UserStatus } from "@libs/types/user_status";
import { User } from "@libs/types/user";
import { ApiListResponse } from "@libs/types/api_list_response";
import { RoleResponse } from "@libs/types/role_response";
import { PermissionResponse } from "@libs/types/permissions_response";
import { Terminal, TerminalResponse } from "@libs/types/terminal";

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

const format = "HH:mm";

axios.defaults.withCredentials = true;

const { TabPane } = Tabs;

const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

export default function Home() {
  const { data: session } = useSession();

  const [isDrawerVisible, setDrawer] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null as any);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const { data, isLoading, error } = useQuery<ApiListResponse<User>, Error>(
    "users",
    fetchAll
  );
  const {
    data: rolesData,
    isLoading: rolesIsLoading,
    error: rolesError,
  } = useQuery<ApiListResponse<RoleResponse>, Error>("roles_list", getAllRoles);

  const {
    data: terminalsData,
    isLoading: terminalsIsLoading,
    error: terminalsError,
  } = useQuery<Terminal[], Error>("terminal_list", fetchTerminals);

  const closeDrawer = () => {
    setEditingRecord(null);
    setDrawer(false);
  };

  const [form] = Form.useForm();

  const submitForm = () => {
    form.submit();
  };

  const editRecord = (record: any) => {
    setEditingRecord({
      ...record,
      roles: record.roles.map((role: any) => role.id),
    });
    form.resetFields();

    const formData = {
      ...record,
      roles: record.roles.map((role: any) => role.id),
    };

    form.setFieldsValue(formData);
    setDrawer(true);
  };

  const onFinish = async (values: any) => {
    setIsSubmittingForm(true);
    if (editingRecord) {
      let roles = rolesData!.content!.filter((role: RoleResponse) =>
        values.roles.includes(role.id)
      );
      await updateById(editingRecord?.id, {
        ...editingRecord,
        ...values,
        permissions: Array.prototype
          .concat(...roles.map((role: RoleResponse) => role.permissions))
          .map((perm: PermissionResponse) => perm.id),
      });
    } else {
      let roles = rolesData!.content!.filter((role: RoleResponse) =>
        values.roles.includes(role.id)
      );
      await create({
        ...values,
        permissions: Array.prototype
          .concat(...roles.map((role: RoleResponse) => role.permissions))
          .map((perm: PermissionResponse) => perm.id),
      });
    }
    setIsSubmittingForm(false);
    closeDrawer();
    // fetchData();
  };

  const addRecord = () => {
    setEditingRecord(null);
    form.resetFields();
    setDrawer(true);
  };

  useEffect(() => {
    // fetchData();
  });

  const columns = [
    {
      title: "Действие",
      dataIndex: "action",
      render: (_: any, record: any) => {
        return (
          <Tooltip title="Редактировать">
            <Button
              type="primary"
              shape="circle"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                editRecord(record);
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Логин",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Имя",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Фамилия",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Супер пользователь",
      dataIndex: "isSuperUser",
      key: "isSuperUser",
      render: (_: any) => {
        return <Switch disabled defaultChecked={_} />;
      },
    },
  ];

  const rows = useMemo(() => {
    let result: User[] = [];
    if (!isLoading && !error) {
      result = data!.content;
    }

    return result;
  }, [data, isLoading, error]);

  return (
    <MainLayout title="Главная">
      <Drawer
        title={
          editingRecord
            ? "Редактировать пользователя"
            : "Добавить нового пользователя"
        }
        width={720}
        onClose={closeDrawer}
        visible={isDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
              Отмена
            </Button>
            <Button
              onClick={submitForm}
              loading={isSubmittingForm}
              type="primary"
            >
              Сохранить
            </Button>
          </div>
        }
      >
        <Form
          layout="vertical"
          form={form}
          size="small"
          onFinish={onFinish}
          initialValues={editingRecord ? editingRecord : undefined}
        >
          <Tabs type="card">
            <TabPane tab="Общие" key="1">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="status" label="Статус">
                    <Select>
                      <Option value={UserStatus.Active}>Активен</Option>
                      <Option value={UserStatus.Blocked}>Заблокирован</Option>
                      <Option value={UserStatus.Inactive}>Неактивен</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="username"
                    label="Логин"
                    rules={[
                      { required: true, message: "Просьба указать логин" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              {!editingRecord && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="password"
                      label="Пароль"
                      rules={[
                        { required: true, message: "Просьба указать пароль" },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    label="Имя"
                    rules={[{ required: true, message: "Просьба ввести имя" }]}
                  >
                    <Input placeholder="Имя" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    label="Фамилия"
                    rules={[{ message: "Просьба ввести фамилию" }]}
                  >
                    <Input placeholder="Фамилия" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="roles"
                    label="Роли"
                    rules={[
                      { required: true, message: "Просьба выбрать роли" },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Выберите роли"
                      style={{ width: "100%" }}
                    >
                      {rolesData &&
                        rolesData!.content.map((role: RoleResponse) => (
                          <Option key={role.id} value={role.id}>
                            {role.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="iiko_terminal_id" label="Филиал">
                    <Select
                      placeholder="Выберите роли"
                      style={{ width: "100%" }}
                    >
                      {terminalsData &&
                        terminalsData!.map((terminal: Terminal) => (
                          <Option
                            key={terminal.terminal_id}
                            value={terminal.terminal_id}
                          >
                            {terminal.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item name="project" label="Бренд">
                    <Select
                      placeholder="Выберите роли"
                      style={{ width: "100%" }}
                    >
                      {terminalsData &&
                        terminalsData!.map((terminal: Terminal) => (
                          <Option
                            key={terminal.terminal_id}
                            value={terminal.terminal_id}
                          >
                            {terminal.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Form>
      </Drawer>
      {error && (
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
        />
      )}
      <div className="my-4">
        <Button type="primary" onClick={addRecord}>
          Добавить
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={rows}
        loading={isLoading}
        rowKey="id"
        scroll={{ x: "calc(700px + 50%)" }}
        size="small"
        bordered
      />
    </MainLayout>
  );
}

Home.Layout = MainLayout;
