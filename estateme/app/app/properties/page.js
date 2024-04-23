"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Form, Carousel, Button, Modal, Select, message, Table } from "antd";
import {
  PencilIcon,
  BellIcon,
  SearchIcon,
  MapIcon,
  PinIcon,
  PropertyIcon,
  UserIcon,
  DateIcon,
  CarIcon,
  GearIcon,
  WalletIcon,
  EyeIcon,
} from "@/components/Icons";
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
          <EyeIcon />
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
          width={620}
          footer={null}
          style={{ top: 40, bottom: 30 }}
        >
          <div>
            <div className="pt-2 flex items-center gap-2">
              <p
                className={`status-cell ${getStatusColor(
                  selectedProperty.statusName
                )}`}
              >
                {selectedProperty.statusName}
              </p>
              <div className="flex items-center gap-1 text-gray-600">
                <UserIcon />
                <p className="text-black">{selectedProperty.employee}</p>
              </div>
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

            <div className="pt-5 gap-3 flex items-center">
              {selectedProperty.buildingName ? (
                <>
                  <div className="uppercase font-semibold">
                    {selectedProperty.buildingName},{" "}
                    {selectedProperty.apartmentFloor} давхар
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded-xl flex items-center gap-2 text-gray-600">
                    <PropertyIcon />
                    <p className="text-black">{selectedProperty.typeName}</p>
                  </div>
                </>
              ) : (
                <div className="bg-gray-100 px-2 py-1 rounded-xl flex items-center gap-2 text-gray-600">
                  <PropertyIcon />
                  <p className="text-black">{selectedProperty.typeName}</p>
                </div>
              )}
            </div>

            <div className="font-semibold py-4 text-[#007cc8]">Байршил</div>
            <div className="flex gap-4 items-center">
              <div className="text-gray-600">
                <MapIcon />
              </div>
              <div className="leading-5">
                <p>{selectedProperty.address}</p>
                <p>Зип код: {selectedProperty.zipCode}</p>
              </div>
            </div>
            {selectedProperty.distanceToDowntown && (
              <div className="pt-4 flex gap-3 items-center">
                <div className="text-gray-600">
                  <PinIcon />
                </div>
                <div className="flex flex-wrap gap-2">
                  <p className="bg-gray-100 px-2 py-1 rounded-xl">
                    Хотын төвөөс {selectedProperty.distanceToDowntown} км
                  </p>
                  {selectedProperty.distanceToSchool && (
                    <p className="bg-gray-100 px-2 py-1 rounded-xl">
                      Ойр сургууль {selectedProperty.distanceToSchool} км
                    </p>
                  )}
                  {selectedProperty.distanceToUniversity && (
                    <p className="bg-gray-100 px-2 py-1 rounded-xl">
                      Ойр их сургууль {selectedProperty.distanceToUniversity} км
                    </p>
                  )}
                  {selectedProperty.distanceToKindergarten && (
                    <p className="bg-gray-100 px-2 py-1 rounded-xl">
                      Ойр цэцэрлэг {selectedProperty.distanceToKindergarten} км
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="font-semibold py-4 text-[#007cc8]">
              Үндсэн мэдээлэл
            </div>
            <div className="flex flex-wrap gap-4 items-start">
              <div className="text-gray-500">
                <PropertyIcon />
              </div>
              <div className="w-[88%]">
                {selectedProperty.buildingTotalFloor && (
                  <div className="pt-[2px] flex justify-between pb-[10px]">
                    <p className="w-3/4">
                      {selectedProperty.buildingTotalFloor} давхар{" "}
                      {selectedProperty.typeName}
                    </p>
                    <p className="w-1/2 text-start">ҮХХ: 2 давхар</p>
                  </div>
                )}
                <div className="pt-[2px] flex justify-between">
                  <p className="w-3/4">
                    Талбай: {selectedProperty.baseArea} м.кв
                  </p>
                  {selectedProperty.ceilingHeight && (
                    <p className="w-1/2 text-start">
                      Таазны өндөр: {selectedProperty.ceilingHeight} метр
                    </p>
                  )}
                </div>
                {selectedProperty.numOfRoom && (
                  <div className="flex gap-2 pt-3 -ml-[5px]">
                    <p className="bg-blue-100 px-2 py-1 rounded-xl">
                      {selectedProperty.numOfRoom} өрөө
                    </p>
                    <p className="bg-gray-100 px-2 py-1 rounded-xl">
                      {selectedProperty.numOfBedroom} унтлагын өрөө
                    </p>
                    <p className="bg-gray-100 px-2 py-1 rounded-xl">
                      {selectedProperty.numOfBathroom} угаалгын өрөө
                    </p>
                  </div>
                )}
                {selectedProperty.numOfWindow && (
                  <div className="flex gap-2 pt-3 -ml-[5px]">
                    <p className="bg-gray-100 px-2 py-1 rounded-xl">
                      {selectedProperty.numOfWindow} цонхтой
                    </p>
                    <p className="bg-gray-100 px-2 py-1 rounded-xl">
                      {selectedProperty.numOfEntry} орцтой
                    </p>
                    <p className="bg-gray-100 px-2 py-1 rounded-xl">
                      {selectedProperty.numOfExit} гарцтай
                    </p>
                  </div>
                )}
                {selectedProperty.buildingMaterial && (
                  <p className="pt-3">
                    Барилгын материал: {selectedProperty.buildingMaterial}
                  </p>
                )}
                {selectedProperty.buildingNumOfCCTV && (
                  <p className="pt-3">
                    Барилгын CCTV тоо: {selectedProperty.buildingNumOfCCTV}
                  </p>
                )}
                {selectedProperty.earthquakeResistance && (
                  <p className="pt-3">
                    Газар хөдлөлтийн тэсвэр:{" "}
                    {selectedProperty.earthquakeResistance} мт
                  </p>
                )}
              </div>
            </div>
            {selectedProperty.commencementDate && (
              <div className="flex pt-4 items-center gap-[9px]">
                <div className="text-gray-500 pl-[2px]">
                  <DateIcon />
                </div>
                <p className="bg-gray-100 px-2 py-1 rounded-xl">
                  Баригдсан: {selectedProperty.commencementDate.slice(0, 10)}
                </p>
                {selectedProperty.launchDate && (
                  <p className="bg-gray-100 px-2 py-1 rounded-xl">
                    Ашиглалтад орсон: {selectedProperty.launchDate.slice(0, 10)}
                  </p>
                )}
              </div>
            )}
            {selectedProperty.numOfGarage && (
              <div className="flex pt-4 items-start gap-4 w-[93%]">
                <div className="text-gray-500">
                  <CarIcon />
                </div>
                <p className="w-3/4">
                  Дотор машин зогсоолын тоо: {selectedProperty.numOfGarage}
                </p>
                {selectedProperty.garagePrice && (
                  <p className="w-1/2 text-start">
                    Үнэ: {selectedProperty.garagePrice}
                  </p>
                )}
              </div>
            )}
            <div className="flex pt-4 items-center gap-2 w-[93%]">
              <div className="text-gray-500">
                <GearIcon />
              </div>
              <div className="w-full flex flex-wrap gap-2 pl-[1px]">
                <p className="bg-gray-100 px-2 py-1 rounded-xl">
                  Төвийн шугамд холбогдсон{" "}
                  <span className="pl-1">
                    {selectedProperty.isCentralWaterSupplies ? "✔️" : "❌"}
                  </span>
                </p>
                {selectedProperty.isLobby !== undefined && (
                  <p className="bg-gray-100 px-2 py-1 rounded-xl">
                    Хүлээлгийн танхим{" "}
                    <span className="pl-1">
                      {selectedProperty.isLobby ? "✔️" : "❌"}
                    </span>
                  </p>
                )}
                <p className="bg-gray-100 px-2 py-1 rounded-xl">
                  Нэмэлт цахилгааны үүсвэр{" "}
                  <span className="pl-1">
                    {selectedProperty.isAdditionalPowerSupplies ? "✔️" : "❌"}
                  </span>
                </p>
                {selectedProperty.isEmergencyExit !== undefined && (
                  <>
                    <p className="bg-gray-100 px-2 py-1 rounded-xl">
                      Аваарын гарц{" "}
                      <span className="pl-1">
                        {selectedProperty.isEmergencyExit ? "✔️" : "❌"}
                      </span>
                    </p>
                    <p className="bg-gray-100 px-2 py-1 rounded-xl">
                      Гадна машины зогсоол{" "}
                      <span className="pl-1">
                        {selectedProperty.isParkingLot ? "✔️" : "❌"}
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="font-semibold py-4 text-[#007cc8]">
              Үнийн мэдээлэл
            </div>
            <div className="flex flex-wrap gap-4 items-start pb-4">
              <div className="text-gray-500">
                <WalletIcon />
              </div>
              <div className="w-[92%]">
                <Table
                  rowClassName={(record, index) =>
                    index === 0 ? "bg-blue-100" : ""
                  }
                  dataSource={[
                    {
                      key: "1",
                      name: "Дундаж үнэ",
                      perSquareMeter: new Intl.NumberFormat("en-US").format(
                        selectedProperty.unitAvgPrice
                      ),
                      total: new Intl.NumberFormat("en-US").format(
                        selectedProperty.totalAvgPrice
                      ),
                    },
                    {
                      key: "2",
                      name: "Дээд үнэ",
                      perSquareMeter: new Intl.NumberFormat("en-US").format(
                        selectedProperty.unitMaxPrice
                      ),
                      total: new Intl.NumberFormat("en-US").format(
                        selectedProperty.totalMaxPrice
                      ),
                    },
                    {
                      key: "3",
                      name: "Доод үнэ",
                      perSquareMeter: new Intl.NumberFormat("en-US").format(
                        selectedProperty.unitMinPrice
                      ),
                      total: new Intl.NumberFormat("en-US").format(
                        selectedProperty.totalMinPrice
                      ),
                    },
                  ]}
                  columns={[
                    {
                      title: "Үнэ",
                      dataIndex: "name",
                    },
                    {
                      title: "1 м.кв",
                      dataIndex: "perSquareMeter",
                    },
                    {
                      title: "Нийт",
                      dataIndex: "total",
                    },
                  ]}
                  pagination={false}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}
