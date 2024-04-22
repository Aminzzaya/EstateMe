"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Form, Carousel, Button, Modal, Select, message, Table } from "antd";
import { PencilIcon, BellIcon, SearchIcon, MapIcon } from "@/components/Icons";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { Option } = Select;
  const [form] = Form.useForm();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getProperties();
  }, []);

  const getProperties = async () => {
    try {
      const response = await fetch("/api/getProperties");
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties);
      } else {
        console.error(
          "Алдаа: Үл хөдлөх хөрөнгийн мэдээлэл FE:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Алдаа: Үл хөдлөх хөрөнгийн мэдээлэл BE:", error);
    }
  };

  const getNextPropertyId = () => {
    const maxNumber = properties.reduce((max, property) => {
      const number = parseInt(property.propertyId.substring(2), 10);
      return isNaN(number) ? max : Math.max(max, number);
    }, 0);
    const nextNumber = maxNumber + 1;
    return `PR${nextNumber.toString().padStart(4, "0")}`;
  };

  const handleNewProperty = () => {
    const newPropertyId = getNextPropertyId();
    localStorage.setItem("propertyId", newPropertyId);
    router.push("properties/new");
  };

  const getStatusColor = (statusName) => {
    switch (statusName) {
      case "Бүртгэгдсэн":
        return "bg-blue-500 text-white px-2 py-1 rounded-xl";
      case "Гэрээ хийгдэж байгаа":
        return "bg-green-500 text-white px-2 py-1 rounded-xl";
      default:
        return "";
    }
  };

  const columns = [
    {
      title: "ҮХХ-ийн дугаар",
      dataIndex: "propertyId",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        const idA = parseInt(a.propertyId.substr(2), 10);
        const idB = parseInt(b.propertyId.substr(2), 10);
        return idA - idB;
      },
    },
    {
      title: "Бүртгэлийн огноо",
      dataIndex: "createdAt",
      render: (createdAt) => new Date(createdAt).toISOString().split("T")[0],
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Байршил",
      dataIndex: "address",
      sorter: (a, b) => b.districtId - a.districtId,
    },
    {
      title: "Төрөл",
      dataIndex: "typeName",
      sorter: (a, b) => a.typeId - b.typeId,
    },
    {
      title: "Агент",
      dataIndex: "employee",
      sorter: (a, b) => {
        const idA = parseInt(a.employeeId.substr(1), 10);
        const idB = parseInt(b.employeeId.substr(1), 10);
        return idA - idB;
      },
    },
    {
      title: "Үнэ",
      dataIndex: "totalAvgPrice",
      render: (totalAvgPrice) => (
        <>
          {new Intl.NumberFormat("en-US").format(totalAvgPrice)}
          <span>₮</span>
        </>
      ),
      sorter: (a, b) => a.totalAvgPrice - b.totalAvgPrice,
    },
    {
      title: "Төлөв",
      dataIndex: "statusName",
      sorter: (a, b) => a.statusId - b.statusId,
      render: (statusName) => (
        <div className={`status-cell ${getStatusColor(statusName)}`}>
          {statusName}
        </div>
      ),
    },
    {
      title: "",
      render: (property) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedProperty(property);
            setPropertyModalOpen(true);
          }}
        >
          <PencilIcon />
        </Button>
      ),
    },
  ];

  const customLocale = {
    triggerAsc: "Багаас нь их рүү ангилах",
    triggerDesc: "Ихээс нь бага руу ангилах",
    cancelSort: "Ангилсныг арилгах",
  };

  return (
    <main className="px-12 py-8">
      <>
        <div className="pt-6 pb-4 flex justify-between">
          <p className="font-semibold text-[15px] text-[#008cc7]">БҮРТГЭЛ</p>
          <div className="flex gap-3">
            <div className="w-8 h-8 p-[5px] bg-[#008cc7] text-white rounded-lg">
              <SearchIcon />
            </div>
            <div className="w-8 h-8 p-[5px] bg-[#008cc7] text-white rounded-lg">
              <BellIcon />
            </div>
          </div>
        </div>
        <div>
          <div>
            <Button
              className="border-[#008cc7] text-[#008cc7]"
              onClick={handleNewProperty}
            >
              + Үл хөдлөх хөрөнгө бүртгэх
            </Button>
          </div>
        </div>
        <div className="pt-6"></div>
        <Table
          columns={columns}
          locale={customLocale}
          dataSource={properties.map((property, index) => ({
            ...property,
            key: index,
          }))}
        />
      </>
      {propertyModalOpen && selectedProperty && (
        <Modal
          title={`ҮХХ-ийн мэдээлэл / ${selectedProperty.propertyId}`}
          open={propertyModalOpen}
          onCancel={() => setPropertyModalOpen(false)}
          width={600}
          footer={null}
        >
          <div>
            <div className="pt-4 flex items-center gap-2">
              <p
                className={`status-cell ${getStatusColor(
                  selectedProperty.statusName
                )}`}
              >
                {selectedProperty.statusName}
              </p>
              <p>{selectedProperty.typeName}</p>
            </div>
            <div className="pt-5 rounded-xl overflow-hidden">
              <Carousel autoplay autoplaySpeed={2000}>
                {selectedProperty.pics.map((pic, index) => (
                  <div key={index}>
                    <img
                      src={pic}
                      alt={`Property Image ${index + 1}`}
                      className="carousel-img"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            <div className="pt-4 flex gap-4 items-center">
              <MapIcon />
              <div className="leading-4">
                <p>{selectedProperty.address}</p>
                <p>Зип код: {selectedProperty.zipCode}</p>
              </div>
            </div>
          </div>
          <div className="py-6">geh met other info</div>
        </Modal>
      )}
    </main>
  );
}
