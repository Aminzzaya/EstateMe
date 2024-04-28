"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message, Table } from "antd";
import { SearchIcon, BellIcon } from "@/components/Icons";
import Nav from "@/components/Nav";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";

export default function Dashboard() {
  const { Option } = Select;
  const [agentReport, setAgentReport] = useState([]);
  const [propertyReport, setPropertyReport] = useState([]);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const today = dayjs();
  const startDate = today.subtract(1, "month");

  const handleSubmit = async (values) => {
    setLoadingBtn(true);
    setAgentReport([]);
    setPropertyReport([]);
    try {
      if (values.type == 1) {
        const response = await fetch("/api/getAgentReport", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: values.startDate,
            endDate: values.endDate,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setAgentReport(data.employeePropertyCounts);
        } else {
          message.error("Үр дүн олдсонгүй.");
        }
      } else if (values.type == 2) {
        const response = await fetch("/api/getPropertyReport", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: values.startDate,
            endDate: values.endDate,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setPropertyReport(data.propertyCountsByType);
        } else {
          message.error("Үр дүн олдсонгүй.");
        }
      }
    } catch {
    } finally {
      setLoadingBtn(false);
    }
  };

  const columns = [
    {
      title: "№",
      dataIndex: "index",
      width: 50,
      render: (_, record, index) => (
        <span className="font-medium">{index + 1}</span>
      ),
    },
    {
      title: "Агент",
      dataIndex: "firstName",
      width: 250,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.profilePicture || "/images/profile.png"}
            alt="Agent"
            className="profile w-9 h-9"
          />
          <p className="pl-4">
            {record.firstName} {record.lastName.slice(0, 1)}.
          </p>
        </div>
      ),
    },
    {
      title: "Бүртгэсэн ҮХХ-ийн тоо",
      dataIndex: "count",
      align: "center",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.count - b.count,
      render: (count) => <div className="text-center">{count}</div>,
    },
    {
      title: "Худалдсан ҮХХ (%)",
      dataIndex: "soldPercentage",
      sorter: (a, b) => a.soldCount - b.soldCount,
      align: "center",
      render: (soldPercentage) => (
        <div className="text-center">{soldPercentage}%</div>
      ),
    },
  ];

  const columnsProperty = [
    {
      title: "№",
      dataIndex: "index",
      width: 50,
      render: (_, record, index) => (
        <span className="font-medium">{index + 1}</span>
      ),
    },
    {
      title: "Төрөл",
      dataIndex: "typeName",
      width: 250,
      sorter: (a, b) => a.typeName.localeCompare(b.typeName),
    },
    {
      title: "Бүртгэсэн ҮХХ-ийн тоо",
      dataIndex: "count",
      align: "center",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.count - b.count,
      render: (count) => <div className="text-center">{count}</div>,
    },
    {
      title: "Худалдсан ҮХХ (%)",
      dataIndex: "soldPercentage",
      sorter: (a, b) => a.soldCount - b.soldCount,
      align: "center",
      render: (soldPercentage) => (
        <div className="text-center">{soldPercentage}%</div>
      ),
    },
  ];

  const customLocale = {
    triggerAsc: "Багаас их рүү ангилах",
    triggerDesc: "Ихээс бага руу ангилах",
    cancelSort: "Ангилсныг арилгах",
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        bodyFont: {
          family: "Montserrat",
        },
        titleFont: {
          family: "Montserrat",
        },
      },
      legend: {
        position: "bottom",
        labels: {
          font: { family: "Montserrat" },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "Montserrat",
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "Montserrat",
          },
        },
      },
    },
  };

  const agentNames = agentReport.map(
    (agent) => `${agent.firstName} ${agent.lastName.slice(0, 1)}.`
  );
  const countData = agentReport.map((agent) => agent.count);
  const soldData = agentReport.map((agent) => agent.soldCount);

  const propertyNames = propertyReport.map(
    (property) => `${property.typeName}`
  );
  const propertyCountData = propertyReport.map((property) => property.count);
  const propertySoldData = propertyReport.map((property) => property.soldCount);

  const data = {
    labels: agentNames,
    datasets: [
      {
        label: "Бүртгэсэн",
        backgroundColor: "#008CC7",
        data: countData,
      },
      {
        label: "Худалдсан",
        backgroundColor: "#22C55E",
        data: soldData,
      },
    ],
  };

  const dataProperty = {
    labels: propertyNames,
    datasets: [
      {
        label: "Бүртгэсэн",
        backgroundColor: "#008CC7",
        data: propertyCountData,
      },
      {
        label: "Худалдсан",
        backgroundColor: "#22C55E",
        data: propertySoldData,
      },
    ],
  };

  return (
    <main className="px-12 py-8">
      <div className="pt-6 pb-4 flex justify-between">
        <p className="font-semibold text-[15px] text-[#008cc7]">ТАЙЛАН</p>
        <Nav />
      </div>
      <div>
        <Form
          layout="vertical"
          className="flex gap-12 items-end"
          onFinish={handleSubmit}
          initialValues={{ startDate: startDate, endDate: today }}
        >
          <Form.Item
            label="Эхлэх хугацаа"
            name="startDate"
            rules={[{ required: true, message: "Сонголт хийнэ үү!" }]}
          >
            <DatePicker placeholder="Сонгох" />
          </Form.Item>
          <Form.Item
            label="Дуусах хугацаа"
            name="endDate"
            rules={[{ required: true, message: "Сонголт хийнэ үү!" }]}
          >
            <DatePicker placeholder="Сонгох" />
          </Form.Item>
          <Form.Item
            label="Төрөл"
            name="type"
            rules={[{ required: true, message: "Сонголт хийнэ үү!" }]}
          >
            <Select placeholder="Сонгох" style={{ width: "170px" }}>
              <Option value="1">Агентаар</Option>
              <Option value="2">ҮХХ-ийн төрлөөр</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              className="bg-[#008cc7] text-white border-none"
              loading={loadingBtn}
            >
              Тайлан гаргах
            </Button>
          </Form.Item>
        </Form>
      </div>
      {agentReport.length > 0 && (
        <div className="pt-4 grid grid-cols-2 gap-12">
          <div className="col-span-1">
            <Table
              locale={customLocale}
              pagination={false}
              columns={columns}
              dataSource={agentReport.map((agent, index) => ({
                ...agent,
                key: index,
              }))}
            />
          </div>
          <div className="col-span-1">
            <p className="font-semibold text-[#008cc7]">График</p>
            <Bar
              options={options}
              data={data}
              height={"220px"}
              className="pt-4 pr-6"
            />
          </div>
        </div>
      )}
      {propertyReport.length > 0 && (
        <div className="pt-4 grid grid-cols-2 gap-12">
          <div className="col-span-1">
            <Table
              locale={customLocale}
              pagination={false}
              columns={columnsProperty}
              dataSource={propertyReport.map((property, index) => ({
                ...property,
                key: index,
              }))}
            />
          </div>
          <div className="col-span-1">
            <p className="font-semibold text-[#008cc7]">График</p>
            <Bar
              options={options}
              data={dataProperty}
              height={"220px"}
              className="pt-4 pr-6"
            />
          </div>
        </div>
      )}
    </main>
  );
}
