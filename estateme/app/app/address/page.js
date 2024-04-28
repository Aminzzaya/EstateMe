"use client";

import React, { useState, useEffect } from "react";
import { Spin, Button, ConfigProvider, Select } from "antd";
import { MapIcon } from "@/components/Icons";
import { LoadingOutlined } from "@ant-design/icons";
import Nav from "@/components/Nav";

export default function Dashboard() {
  const { Option } = Select;
  const [agentReport, setAgentReport] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [streets, setStreets] = useState([]);
  const [clickedCity, setClickedCity] = useState(null);
  const [clickedDistrict, setClickedDistrict] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCities();
  }, []);

  const getCities = async () => {
    setDistricts([]);
    setStreets([]);
    setLoading(true);
    try {
      const response = await fetch("/api/getCities");
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities);
      } else {
        console.error("Алдаа: Хотын мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Хотын мэдээлэл BE:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDistrict = async (cityId) => {
    setStreets([]);
    try {
      const response = await fetch("/api/getDistrict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cityId }),
      });
      if (response.ok) {
        const data = await response.json();
        setDistricts(data.district);
      } else {
        console.error("Алдаа: Дүүргийн мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Дүүргийн мэдээлэл BE:", error);
    }
  };

  const getStreet = async (districtId) => {
    try {
      const response = await fetch("/api/getStreet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ districtId }),
      });
      if (response.ok) {
        const data = await response.json();
        setStreets(data.street);
      } else {
        console.error("Алдаа: Хорооны мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Хорооны мэдээлэл BE:", error);
    }
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
              ХАЯГИЙН МЭДЭЭЛЭЛ
            </p>
            <Nav />
          </div>
          <div>
            <div>
              <Button
                className="border-[#008cc7] text-[#008cc7]"
                //onClick={() => setRegisterModalOpen(true)}
              >
                + Хаяг нэмэх
              </Button>
            </div>
          </div>
          <div className="pt-6 grid grid-cols-3">
            <div>
              <p className="font-semibold text-[#008cc7]">Хот, аймаг</p>
              <div className="pt-2">
                {cities.map((city, index) => (
                  <div
                    className="py-1 flex cursor-pointer"
                    onClick={() => {
                      getDistrict(city.cityId);
                      setClickedCity(city.cityId);
                    }}
                  >
                    <p
                      className={`p-1 px-3 rounded-xl ${
                        clickedCity === city.cityId
                          ? "bg-[#008cc7] text-white"
                          : "bg-gray-100 hover:bg-[#008cc7] hover:text-white"
                      }`}
                    >
                      {city.cityName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-[#008cc7]">Дүүрэг, сум</p>
              <div className="pt-2">
                {districts.map((district, index) => (
                  <div
                    className="py-1 flex cursor-pointer"
                    onClick={() => {
                      getStreet(district.districtId);
                      setClickedDistrict(district.districtId);
                    }}
                  >
                    <p
                      className={`p-1 px-3 rounded-xl ${
                        clickedDistrict === district.districtId
                          ? "bg-[#008cc7] text-white"
                          : "bg-gray-100 hover:bg-[#008cc7] hover:text-white"
                      }`}
                    >
                      {district.districtName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-[#008cc7]">Хороо, баг</p>
              <div className="pt-2">
                {streets.map((street) => (
                  <div className="py-1 flex cursor-pointer">
                    <p className="bg-gray-100 hover:bg-[#008cc7] hover:text-white p-1 px-3 rounded-xl">
                      {street.streetName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
