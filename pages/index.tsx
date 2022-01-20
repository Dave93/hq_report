import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useSession, signIn, signOut, getSession } from "next-auth/react";
import MainLayout from "@components/ui/MainLayout";
import {
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
import { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";

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

const { publicRuntimeConfig } = getConfig();
let webAddress = publicRuntimeConfig.apiUrl;

const format = "HH:mm";

axios.defaults.withCredentials = true;

const { TabPane } = Tabs;

const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

export default function Home() {
  const { data: session } = useSession();

  const [isDrawerVisible, setDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null as any);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const closeDrawer = () => {
    setEditingRecord(null);
    setDrawer(false);
  };

  const [form] = Form.useForm();

  const submitForm = () => {
    form.submit();
  };

  const fetchData = async () => {
    setIsLoading(true);
    const {
      data: { data: result },
    } = await axios.get(`${webAddress}access/users`);
    setData(result);
    setIsLoading(false);
  };

  const onFinish = async (values: any) => {
    setIsSubmittingForm(true);
    if (editingRecord) {
      await axios.put(`${webAddress}/api/news/${editingRecord?.id}`, {
        ...editingRecord,
        ...values,
      });
    } else {
      await axios.post(`${webAddress}/api/news/`, {
        ...values,
      });
    }
    setIsSubmittingForm(false);
    closeDrawer();
    fetchData();
  };

  useEffect(() => {
    fetchData();
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
                // editRecord(record);
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "Активность",
      dataIndex: "active",
      key: "active",
      render: (_: any) => {
        return <Switch disabled defaultChecked={_} />;
      },
    },
    {
      title: "Сортировка",
      dataIndex: "sort",
      key: "sort",
    },
    {
      title: "Заголовок(RU)",
      dataIndex: "name",
      key: "name",
      sorter: {
        compare: (a: any, b: any) => a.name - b.name,
      },
    },
    {
      title: "Заголовок(UZ)",
      dataIndex: "name_uz",
      key: "name_uz",
      sorter: {
        compare: (a: any, b: any) => a.name - b.name,
      },
    },
    {
      title: "Описание(RU)",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Описание(UZ)",
      dataIndex: "description_uz",
      key: "description_uz",
    },
  ];

  return (
    <MainLayout title="Главная">
      <Drawer
        title={
          editingRecord ? "Редактировать новость" : "Добавить новую новость"
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
                  <Form.Item
                    name="active"
                    label="Активность"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="sort" label="Сортировка">
                    <InputNumber />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Название(RU)"
                    rules={[
                      { required: true, message: "Просьба ввести название" },
                    ]}
                  >
                    <Input placeholder="Просьба ввести название" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="name_uz"
                    label="Название(UZ)"
                    rules={[{ message: "Просьба ввести название" }]}
                  >
                    <Input placeholder="Просьба ввести название" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="description" label="Описание(RU)">
                    <TextArea rows={4} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="description_uz" label="Описание(UZ)">
                    <TextArea rows={4} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="locale" label="Язык сайта">
                    <Select>
                      <Option value="">Выберите вариант</Option>
                      <Option value="ru">Русский</Option>
                      <Option value="uz">Узбекский</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Form>
      </Drawer>
      <Table
        columns={columns}
        dataSource={data}
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
