"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Carousel, message, Modal, Table } from "antd";
import {
  BackIcon,
  PropertyIcon,
  UserIcon,
  MapIcon,
  WalletIcon,
  PrinterIcon,
  PinIcon,
  DateIcon,
  CarIcon,
  GearIcon,
} from "@/components/Icons";
import { useRouter } from "next/navigation";

export default function Search() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const propertiesJSON = localStorage.getItem("searchResults");
    const properties = JSON.parse(propertiesJSON);

    const filtersJSON = localStorage.getItem("searchFilters");
    const filters = JSON.parse(filtersJSON);

    if (properties) {
      setProperties(properties);
      setFilters(filters);
    }
  }, []);

  const getStatusColor = (statusName) => {
    switch (statusName) {
      case "Бүртгэгдсэн":
        return "bg-[#008CC7]  text-white px-2 py-1 rounded-xl";
      case "Тохиролцсон":
        return "bg-[#7C3AED] text-white px-2 py-1 rounded-xl";
      case "Гэрээ хийгдэж байгаа":
        return "bg-[#FDE047] text-black px-2 py-1 rounded-xl";
      case "Худалдсан":
        return "bg-[#22C55E] text-white px-2 py-1 rounded-xl";
      case "Яаралтай":
        return "bg-[#EA580C] text-white px-2 py-1 rounded-xl";
      case "Цуцалсан":
        return "bg-[#DC2626] text-white px-2 py-1 rounded-xl";
      default:
        return "";
    }
  };

  const priceFormatter = (value) => {
    if (!value) return "";
    const formattedValue = value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedValue}`;
  };

  const handleResultClick = (property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  return (
    <main className="px-12 py-8">
      <div className="pt-6 pb-5 flex gap-4">
        <div
          className="rounded-lg p-1 cursor-pointer border border-[#008cc7] -mt-1 btn-back"
          onClick={() => router.back()}
        >
          <BackIcon />
        </div>

        <p className="font-semibold text-[15px] text-[#008cc7]">
          ХАЙЛТЫН ҮР ДҮН
        </p>
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        {filters.purpose && (
          <div className="flex">
            <p className="bg-gray-100 p-1 px-3 rounded-xl">
              🧳 {filters.purpose}
            </p>
          </div>
        )}
        {filters.regionId && (
          <div className="flex">
            <p className="bg-gray-100 p-1 px-3 rounded-xl">Монгол улс</p>
          </div>
        )}
        {filters.cityId && (
          <div className="flex">
            <p className="bg-gray-100 p-1 px-3 rounded-xl">
              🇲🇳 {filters.cityName}
            </p>
          </div>
        )}
        {filters.districtId && (
          <div className="flex">
            <p className="bg-gray-100 p-1 px-3 rounded-xl">
              {filters.districtName}
            </p>
          </div>
        )}
        {filters.typeId && (
          <div className="flex">
            <p className="bg-gray-100 p-1 px-3 rounded-xl flex items-center gap-2 text-gray-600">
              <PropertyIcon />
              <p>{properties[0].typeName}</p>
            </p>
          </div>
        )}
        {filters.numOfRoom && (
          <div className="flex">
            <p className="bg-gray-100 p-1 px-3 rounded-xl">
              {filters.numOfRoom}+ өрөөтэй
            </p>
          </div>
        )}
        {filters.distanceToDowntown && (
          <div className="flex">
            <p className="bg-gray-100 p-1 px-3 rounded-xl">
              Хотын төвөөс {`<`}
              {filters.distanceToDowntown == 100
                ? "7+"
                : filters.distanceToDowntown}{" "}
              км
            </p>
          </div>
        )}
        {filters.minBaseArea && (
          <div className="flex">
            <p className="bg-gray-100 p-1 px-3 rounded-xl flex">
              Талбай: {filters.minBaseArea}
              {filters.maxBaseArea && <p>-{filters.maxBaseArea}</p>} м.кв
            </p>
          </div>
        )}
        {filters.minTotalAvgPrice && (
          <div className="flex">
            <p className="bg-gray-100 p-1 px-3 rounded-xl flex">
              Үнэ: {priceFormatter(filters.minTotalAvgPrice)}₮
              {filters.maxTotalAvgPrice && (
                <p>-{priceFormatter(filters.maxTotalAvgPrice)}₮</p>
              )}
            </p>
          </div>
        )}
      </div>
      <div className="pt-4">
        <p>Нийт: {properties.length} үр дүн</p>
      </div>
      <div className="grid grid-cols-3 gap-x-8 gap-y-6 pt-4">
        {properties &&
          properties.map((property) => (
            <div
              className="page-content-sm cursor-pointer"
              onClick={() => handleResultClick(property)}
              key={property.propertyId}
            >
              <div className="relative">
                <img
                  className="w-full h-52 object-cover rounded-[19px]"
                  src={property.pics[0]}
                  alt="Property Image"
                />
                <div className="absolute flex items-center gap-[5px] text-[#008cc7] top-3 left-3 bg-blue-100 p-1 rounded-xl">
                  <UserIcon />
                  <p>{property.employee}</p>
                </div>
              </div>

              <div className="p-4">
                {property.buildingName && (
                  <div className="pb-3 uppercase font-medium">
                    {property.buildingName}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <p className="font-medium">{property.propertyId}</p>
                  <div className="bg-gray-100 px-2 py-1 rounded-xl flex items-center gap-2 text-gray-600">
                    <PropertyIcon />
                    <p className="text-black">{property.typeName}</p>
                  </div>
                </div>
                <div className="pt-3 flex gap-2 items-center">
                  <MapIcon />
                  {property.address}
                </div>
                <div className="pt-3 flex gap-2 items-center">
                  <WalletIcon />
                  {property.baseArea} м.кв •{" "}
                  {priceFormatter(property.totalAvgPrice)}₮
                </div>
                <div className="pt-3 flex items-center gap-2">
                  <p
                    className={`status-cell ${getStatusColor(
                      property.statusName
                    )}`}
                  >
                    {property.statusName}
                  </p>
                  <p>🧳 {property.purpose}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      {modalOpen && selectedProperty && (
        <Modal
          title={`Үл хөдлөх хөрөнгийн дэлгэрэнгүй мэдээлэл / ${selectedProperty.propertyId}`}
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          width={620}
          footer={null}
          style={{ top: 40, bottom: 30 }}
        >
          <div>
            <div className="pt-2 justify-between flex">
              <div className="flex items-center gap-4">
                <p
                  className={`status-cell ${getStatusColor(
                    selectedProperty.statusName
                  )}`}
                >
                  {selectedProperty.statusName}
                </p>
                <p>🧳 {selectedProperty.purpose}</p>
                <div className="flex items-center gap-1 text-gray-600">
                  <p className="font-semibold">Агент:</p>
                  <p className="text-black">{selectedProperty.employee}</p>
                </div>
              </div>
              <Button
                className="flex items-center gap-2 text-[#008cc7]"
                onClick={() => window.print()}
              >
                <PrinterIcon />
                Хэвлэх
              </Button>
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
                    {selectedProperty.apartmentFloor} давхарт
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
                <p>
                  {selectedProperty.address}, {selectedProperty.zipCode}
                </p>
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
                    <p className="w-1/2 text-start">
                      ҮХХ: {selectedProperty.apartmentFloor} давхарт
                    </p>
                  </div>
                )}
                <div className="pt-[2px] flex justify-between">
                  <p className="w-3/4">
                    Талбай: {selectedProperty.baseArea} м.кв
                  </p>
                  {selectedProperty.ceilingHeight && (
                    <p className="w-1/2 text-start">
                      Таазны өндөр: {selectedProperty.ceilingHeight} м
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
                  </>
                )}
                {selectedProperty.numOfWindow && (
                  <div className="flex gap-2 pt-3 -ml-[5px]">
                    <p className="bg-gray-100 px-2 py-1 rounded-xl">
                      {selectedProperty.numOfWindow} цонх
                    </p>
                    <p className="bg-gray-100 px-2 py-1 rounded-xl">
                      {selectedProperty.numOfEntry} орц
                    </p>
                    <p className="bg-gray-100 px-2 py-1 rounded-xl">
                      {selectedProperty.numOfExit} гарц
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
                    {selectedProperty.earthquakeResistance} магнитуд
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
                    Баригдсан: {selectedProperty.commencementDate.slice(0, 10)}
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
                    Дотор машин зогсоолын тоо: {selectedProperty.numOfGarage}
                  </p>
                  {selectedProperty.garagePrice && (
                    <p className="w-1/2 text-start">
                      Үнэ: {priceFormatter(selectedProperty.garagePrice)}₮
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
                    index === 0 ? "bg-gray-100" : ""
                  }
                  dataSource={[
                    {
                      key: "1",
                      name: "Дундаж үнэ",
                      perSquareMeter:
                        new Intl.NumberFormat("en-US").format(
                          selectedProperty.unitAvgPrice
                        ) + "₮",
                      total:
                        new Intl.NumberFormat("en-US").format(
                          selectedProperty.totalAvgPrice
                        ) + "₮",
                    },
                    {
                      key: "2",
                      name: "Дээд үнэ",
                      perSquareMeter:
                        new Intl.NumberFormat("en-US").format(
                          selectedProperty.unitMaxPrice
                        ) + "₮",
                      total:
                        new Intl.NumberFormat("en-US").format(
                          selectedProperty.totalMaxPrice
                        ) + "₮",
                    },
                    {
                      key: "3",
                      name: "Доод үнэ",
                      perSquareMeter:
                        new Intl.NumberFormat("en-US").format(
                          selectedProperty.unitMinPrice
                        ) + "₮",
                      total:
                        new Intl.NumberFormat("en-US").format(
                          selectedProperty.totalMinPrice
                        ) + "₮",
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
