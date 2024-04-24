"use client";

import Image from "next/image";
import "chart.js/auto";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Spin,
  ConfigProvider,
  Modal,
  Carousel,
  Tooltip,
  message,
} from "antd";
import {
  MapIcon,
  PropertyIcon,
  UserIcon,
  PencilIcon,
  DownloadIcon,
  GearIcon,
  PinIcon,
  WalletIcon,
  TrashIcon,
  DateIcon,
  CarIcon,
} from "@/components/Icons";
import { Doughnut } from "react-chartjs-2";
import { LoadingOutlined } from "@ant-design/icons";
import Nav from "@/components/Nav";

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    const employee = localStorage.getItem("employeeId");
    if (employee) {
      getProperties(employee);
      setEmployeeId(employee);
    }
  }, []);

  const getProperties = async (employeeId) => {
    setLoading(true);
    try {
      const response = await fetch("/api/getPropertiesById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId }),
      });
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
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (propertyId) => {
    setLoadingBtn(true);
    try {
      const response = await fetch("/api/deleteProperty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId }),
      });
      if (response.ok) {
        message.success("Амжилттай устгалаа!");
        setDeleteModalOpen(false);
        getProperties(employeeId);
      } else {
        console.error(
          "Алдаа: Үл хөдлөх хөрөнгө устгах FE:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Алдаа: Үл хөдлөх хөрөнгө устгах BE:", error);
    } finally {
      setLoading(false);
    }
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
      title: "Эзэмшигч",
      dataIndex: "ownerName",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
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
      title: "Төрөл",
      dataIndex: "typeName",
      sorter: (a, b) => a.typeId - b.typeId,
    },

    {
      title: "Байршил",
      dataIndex: "address",
      sorter: (a, b) => b.districtId - a.districtId,
    },
    {
      title: "Төлөв",
      dataIndex: "statusName",
      sorter: (a, b) => a.statusId - b.statusId,
      render: (statusName) => (
        <div
          className={`status-cell text-center ${getStatusColor(statusName)}`}
        >
          {statusName}
        </div>
      ),
    },
    {
      title: "",
      render: (property) => (
        <>
          <Tooltip title="Засварлах">
            <Button
              className="text-[#008cc7]"
              type="link"
              onClick={() => {
                setSelectedProperty(property);
                setPropertyModalOpen(true);
              }}
            >
              <PencilIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Устгах">
            <Button
              className="text-[#008CC7]"
              type="link"
              onClick={() => {
                setSelectedProperty(property);
                setDeleteModalOpen(true);
              }}
            >
              <TrashIcon />
            </Button>
          </Tooltip>
        </>
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
  };

  const labels = [
    "Бүртгэгдсэн",
    "Тохиролцсон",
    "Гэрээ хийгдэж байгаа",
    "Худалдсан",
    "Яаралтай",
    "Цуцалсан",
  ];

  const doughnut = labels.reduce((counts, label) => {
    counts[label] = 0;
    return counts;
  }, {});

  properties.forEach((property) => {
    const statusName = property.statusName;
    if (labels.includes(statusName)) {
      doughnut[statusName]++;
    }
  });

  const data = Object.values(doughnut);

  const doughnutData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: [
          "#3B82F6",
          "#7C3AED",
          "#FDE047",
          "#22C55E",
          "#EA580C",
          "#DC2626",
        ],
        label: "Үл хөдлөх хөрөнгө",
      },
    ],
  };

  return (
    <>
      {loading ? (
        <ConfigProvider
          theme={{
            token: {
              colorBgMask: "transparent",
            },
          }}
        >
          <Spin
            fullscreen
            wrapperClassName="spin"
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24,
                }}
                spin
              />
            }
          />
        </ConfigProvider>
      ) : (
        <main className="px-12 py-8">
          <div className="pt-6 pb-4 flex justify-between">
            <p className="font-semibold text-[15px] text-[#008cc7]">
              МИНИЙ ЛИСТ
            </p>
            <Nav />
          </div>
          <Table
            columns={columns}
            locale={customLocale}
            pagination={false}
            //scroll={{ y: 240 }}
            dataSource={properties.map((property, index) => ({
              ...property,
              key: index,
            }))}
          />
          <div className="grid grid-cols-5 pt-10 gap-16">
            <div className="col-span-2">
              <p className="font-semibold text-[15px] text-[#008cc7]">ГЭРЭЭ</p>
              <div className="page-content mt-4">
                <a href="https://res.cloudinary.com/estateme/image/upload/%D0%97%D1%83%D1%83%D1%87%D0%BB%D0%B0%D0%BB%D1%8B%D0%BD_%D0%B3%D1%8D%D1%80%D1%8D%D1%8D_ypw6mk.pdf" target="_blank" rel="noopener noreferrer" className="flex gap-5 items-center border-b p-4 cursor-pointer hover:bg-gray-100 rounded-t-xl">
                  <div className="text-[#008cc7]">
                    <DownloadIcon />
                  </div>
                  <p>Зуучлалын гэрээ</p>
                </a>
                <a href="https://res.cloudinary.com/estateme/image/upload/%D2%AE%D0%BB_%D1%85%D3%A9%D0%B4%D0%BB%D3%A9%D1%85_%D1%85%D3%A9%D1%80%D3%A9%D0%BD%D0%B3%D3%A9_%D0%B7%D1%83%D1%83%D1%87%D0%BB%D0%B0%D0%BB%D1%8B%D0%BD_%D0%BE%D0%BD%D1%86%D0%B3%D0%BE%D0%B8%CC%86_%D1%8D%D1%80%D1%85%D0%B8%D0%B8%CC%86%D0%BD_%D0%B3%D1%8D%D1%80%D1%8D%D1%8D_n9jmho.pdf" target="_blank" rel="noopener noreferrer" className="flex gap-5 items-center border-b p-4 cursor-pointer hover:bg-gray-100 rounded-t-xl">
                  <div className="text-[#008cc7]">
                    <DownloadIcon />
                  </div>
                  <p>Үл хөдлөх хөрөнгө зуучлалын онцгой эрхийн гэрээ</p>
                </a>
                <a href="https://res.cloudinary.com/estateme/image/upload/%D2%AE%D0%BB_%D1%85%D3%A9%D0%B4%D0%BB%D3%A9%D1%85_%D1%85%D3%A9%D1%80%D3%A9%D0%BD%D0%B3%D3%A9_%D1%85%D1%83%D0%B4%D0%B0%D0%BB%D0%B4%D0%B0%D1%85_%D1%85%D1%83%D0%B4%D0%B0%D0%BB%D0%B4%D0%B0%D0%BD_%D0%B0%D0%B2%D0%B0%D1%85_%D0%B3%D1%8D%D1%80%D1%8D%D1%8D_sqt9iu.pdf" target="_blank" rel="noopener noreferrer" className="flex gap-5 items-center border-b p-4 cursor-pointer hover:bg-gray-100 rounded-t-xl">
                  <div className="text-[#008cc7]">
                    <DownloadIcon />
                  </div>
                  <p>Үл хөдлөх хөрөнгө худалдах, худалдан авах гэрээ</p>
                </a>
                <a href="https://res.cloudinary.com/estateme/image/upload/%D2%AE%D0%BB_%D1%85%D3%A9%D0%B4%D0%BB%D3%A9%D1%85_%D1%85%D3%A9%D1%80%D3%A9%D0%BD%D0%B3%D3%A9_%D1%82%D2%AF%D1%80%D1%8D%D1%8D%D1%81%D0%B8%D0%B8%CC%86%D0%BD_%D0%B3%D1%8D%D1%80%D1%8D%D1%8D_px3qkh.pdf" target="_blank" rel="noopener noreferrer" className="flex gap-5 items-center border-b p-4 cursor-pointer hover:bg-gray-100 rounded-t-xl">
                  <div className="text-[#008cc7]">
                    <DownloadIcon />
                  </div>
                  <p>Үл хөдлөх хөрөнгө түрээсийн гэрээ</p>
                </a>
              </div>
            </div>
            <div className="col-span-3 pl-12">
              <p className="font-semibold text-[15px] text-[#008cc7]">ГРАФИК</p>
              <p className="pl-[110px] py-2 font-medium">2024 оны I улирал</p>
              <div className="h-[350px]">
                <Doughnut options={options} data={doughnutData} />
              </div>
            </div>
          </div>
          {propertyModalOpen && selectedProperty && (
            <Modal
              title={`Үл хөдлөх хөрөнгийн дэлгэрэнгүй мэдээлэл / ${selectedProperty.propertyId}`}
              open={propertyModalOpen}
              onCancel={() => setPropertyModalOpen(false)}
              width={620}
              style={{ top: 40, bottom: 30 }}
              cancelText="Буцах"
              okText="Шинэчлэх"
              okButtonProps={{ style: { backgroundColor: "green" } }}
            >
              <div>
                <div className="pt-2 flex items-center gap-4">
                  <p
                    className={`status-cell ${getStatusColor(
                      selectedProperty.statusName
                    )}`}
                  >
                    {selectedProperty.statusName}
                  </p>
                  <p>🧳 {selectedProperty.purpose}</p>
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
                        <p className="text-black">
                          {selectedProperty.typeName}
                        </p>
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
                <div className="border-b pt-4 mx-10"></div>
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
                          Ойр их сургууль{" "}
                          {selectedProperty.distanceToUniversity} км
                        </p>
                      )}
                      {selectedProperty.distanceToKindergarten && (
                        <p className="bg-gray-100 px-2 py-1 rounded-xl">
                          Ойр цэцэрлэг {selectedProperty.distanceToKindergarten}{" "}
                          км
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
                        <p className="w-1/2 text-start">
                          ҮХХ: {selectedProperty.apartmentFloor} давхар
                        </p>
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
                    <div className="border-b pt-4"></div>
                    {selectedProperty.numOfRoom && (
                      <>
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
                        <div className="border-b pt-4"></div>
                      </>
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
                  <>
                    <div className="border-t mt-4 mx-10"></div>
                    <div className="flex pt-4 items-center gap-[9px]">
                      <div className="text-gray-500 pl-[2px]">
                        <DateIcon />
                      </div>
                      <p className="bg-gray-100 px-2 py-1 rounded-xl">
                        Баригдсан:{" "}
                        {selectedProperty.commencementDate.slice(0, 10)}
                      </p>
                      {selectedProperty.launchDate && (
                        <p className="bg-gray-100 px-2 py-1 rounded-xl">
                          Ашиглалтад орсон:{" "}
                          {selectedProperty.launchDate.slice(0, 10)}
                        </p>
                      )}
                    </div>
                    <div className="border-b pt-4 mx-10"></div>
                  </>
                )}
                {selectedProperty.numOfGarage && (
                  <>
                    <div className="flex pt-4 items-start gap-4 w-[93%]">
                      <div className="text-gray-500">
                        <CarIcon />
                      </div>
                      <p className="w-3/4">
                        Дотор машин зогсоолын тоо:{" "}
                        {selectedProperty.numOfGarage}
                      </p>
                      {selectedProperty.garagePrice && (
                        <p className="w-1/2 text-start">
                          Үнэ: {selectedProperty.garagePrice}
                        </p>
                      )}
                    </div>
                    <div className="border-b pt-4 mx-10"></div>
                  </>
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
                        {selectedProperty.isAdditionalPowerSupplies
                          ? "✔️"
                          : "❌"}
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
          {deleteModalOpen && selectedProperty && (
            <Modal
              title="Бүртгэл устгах"
              open={deleteModalOpen}
              onCancel={() => setDeleteModalOpen(false)}
              cancelText="Буцах"
              okText="Устгах"
              okButtonProps={{ style: { backgroundColor: "#DC2626" } }}
              onOk={() => deleteProperty(selectedProperty.propertyId)}
            >
              <div>
                <div className="pt-3 pb-4 flex items-center gap-2">
                  <DateIcon />
                  <p>
                    Бүртгэсэн огноо: {selectedProperty.createdAt.slice(0, 10)}
                  </p>
                </div>
                <p className="text-justify pb-1">
                  {selectedProperty.propertyId} ҮХХ-ийн дугаартай,{" "}
                  {selectedProperty.address} хаягтай,{" "}
                  {selectedProperty.ownerName} эзэмшигчтэй бүртгэлийг устгах уу?
                </p>
              </div>
            </Modal>
          )}
        </main>
      )}
    </>
  );
}
