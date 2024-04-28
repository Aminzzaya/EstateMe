"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, List, message } from "antd";
import {
  BackIcon,
  PropertyIcon,
  UserIcon,
  MapIcon,
  WalletIcon,
} from "@/components/Icons";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";

export default function Search() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState([]);

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

  return (
    <main className="px-12 py-8">
      <div className="pt-6 pb-5 flex gap-4 justify-between">
        <div className="flex gap-4">
          <div
            className="rounded-lg p-1 cursor-pointer border border-[#008cc7] -mt-1 btn-back flex"
            onClick={() => router.back()}
          >
            <BackIcon />
          </div>
          <p className="font-semibold text-[15px] text-[#008cc7]">
            ХАЙЛТЫН ҮР ДҮН
          </p>
        </div>

        <Nav />
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
              Хотын төвөөс ~{filters.distanceToDowntown} км
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
                <p>-{priceFormatter(filters.maxTotalAvgPrice)}</p>
              )}
              ₮
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
    </main>
  );
}
