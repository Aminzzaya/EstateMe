"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SearchIcon, BellIcon, DateIcon, UserIcon } from "./Icons";
import {
  Button,
  Dropdown,
  Modal,
  Radio,
  Divider,
  Space,
  Form,
  Select,
  InputNumber,
  message,
} from "antd";

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    getCities();
    const employee = localStorage.getItem("employeeId");
    if (employee) {
      getNotifications(employee);
      setEmployeeId(employeeId);
      const intervalId = setInterval(() => {
        getNotifications(employee);
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, []);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    handleMarkAsRead();
    setModalVisible(false);
    getNotifications(employeeId);
  };

  const handleShowAllNotifications = () => {
    router.push("/app/notifications");
  };

  const handleMarkAsRead = async () => {
    try {
      const response = await fetch("/api/markNotificationAsRead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId: selectedNotification._id }),
      });

      if (response.ok) {
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      message.error("An error occurred while marking notification as read");
    }
  };

  const items = [
    {
      key: "0",
      type: "group",
      label: "Мэдэгдлүүд",
      align: "center",
      style: { color: "black", paddingBlock: "5px", fontWeight: 600 },
    },
    {
      type: "divider",
    },
    ...notifications
      .map((notification, index) => [
        {
          key: `${index + 1}`,
          label: (
            <div
              className="flex items-center gap-4"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="text-[#008cc7]">
                <BellIcon />
              </div>
              <div>
                <span>{notification.body}</span>
                <div className="pt-1 flex">
                  <p className="bg-[#008cc7] text-white p-1 px-2 rounded-lg text-xs">
                    {notification.employee}
                  </p>
                </div>
                <div className="text-xs text-gray-500 pt-1 flex items-center gap-1">
                  <DateIcon width={14} />
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ),
        },
        {
          type: "divider",
        },
      ])
      .flat(),
    {
      key: "100",
      label: "Бүгд",
      onClick: handleShowAllNotifications,
      align: "center",
      style: {
        color: "#008cc7",
        paddingBlock: "5px",
        fontWeight: 500,
      },
    },
  ];

  const getNotifications = async (employeeId) => {
    try {
      const response = await fetch("/api/getNotifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId }),
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      } else {
        console.error("Алдаа: Мэдэгдлүүд FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Мэдэгдлүүд BE:", error);
    }
  };

  const getCities = async () => {
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
    }
  };

  const handleCitySelect = (value) => {
    getDistrict(value);
  };

  const getDistrict = async (cityId) => {
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

  const handleSearch = async () => {
    const values = await form.validateFields();
    setLoadingBtn(true);
    try {
      const response = await fetch("/api/searchProperty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.properties.length > 0) {
          localStorage.setItem(
            "searchResults",
            JSON.stringify(data.properties)
          );
          localStorage.setItem("searchFilters", JSON.stringify(data.filters));
          setSearchModalOpen(false);
          router.push("/app/properties/search");
        } else {
          message.error("Үр дүн олдсонгүй!");
        }
      } else {
        console.error(
          "Алдаа: Үл хөдлөх хөрөнгө хайлт FE:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Алдаа: Үл хөдлөх хөрөнгө хайлт BE:", error);
    } finally {
      setLoadingBtn(false);
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
    <main>
      <ul className="flex gap-3">
        <Button
          className="h-8 p-[5px] hover:bg-[#008cc7] text-[#008cc7] rounded-lg border-blue-300"
          onClick={() => setSearchModalOpen(true)}
        >
          <SearchIcon />
        </Button>
        <li>
          <Dropdown
            placement="bottomRight"
            arrow
            trigger="click"
            menu={{ items }}
            overlayStyle={{ width: "300px" }}
          >
            <Button className="relative w-8 h-8 p-[5px] hover:bg-[#008cc7] text-[#008cc7] rounded-lg border-blue-300">
              <BellIcon />
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                <div className="w-5 h-5">
                  <p className="bg-red-500 rounded-full text-white text-xs py-[2px]">
                    {notifications.length}
                  </p>
                </div>
              </div>
            </Button>
          </Dropdown>
        </li>
      </ul>
      {setSearchModalOpen && (
        <Modal
          width={850}
          open={searchModalOpen}
          onCancel={() => setSearchModalOpen(false)}
          title="Дэлгэрэнгүй хайлт"
          cancelText="Буцах"
          okText="Хайх"
          okButtonProps={{
            style: { backgroundColor: "green" },
            loading: loadingBtn,
          }}
          onOk={handleSearch}
        >
          <Form layout="vertical" form={form}>
            <div className="pt-4 grid grid-cols-3 gap-12">
              <div className="col-span-1">
                <p className="text-[#008cc7] font-semibold">Зорилго</p>
                <Form.Item name="purpose">
                  <Radio.Group
                    className="pt-2"
                    options={[
                      {
                        label: "Худалдах",
                        value: "Худалдах",
                      },
                      {
                        label: "Түрээслүүлэх",
                        value: "Түрээслүүлэх",
                      },
                    ]}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </Form.Item>
                <p className="pb-2 text-[#008cc7] font-semibold">Байршил</p>
                <Form.Item name="regionId">
                  <Select placeholder="Бүсчлэл">
                    <Option value={1}>Монгол</Option>
                  </Select>
                </Form.Item>
                <Form.Item className="-mt-3" name="cityId">
                  <Select placeholder="Хот, аймаг" onChange={handleCitySelect}>
                    {cities.map((city) => (
                      <Option key={city.cityId} value={city.cityId}>
                        {city.cityName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item className="-mt-3" name="districtId">
                  <Select placeholder="Дүүрэг, сум">
                    {districts.map((district) => (
                      <Option
                        key={district.districtId}
                        value={district.districtId}
                      >
                        {district.districtName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-span-1">
                <p className="text-[#008cc7] font-semibold">
                  Үл хөдлөх хөрөнгийн төрөл
                </p>
                <Form.Item name="typeId">
                  <Radio.Group
                    className="pt-2"
                    options={[
                      {
                        label: "Орон сууц",
                        value: 1,
                      },
                      {
                        label: "Амины сууц",
                        value: 2,
                      },
                      {
                        label: "Пентхаус",
                        value: 3,
                      },
                      {
                        label: "Газар",
                        value: 4,
                      },
                      {
                        label: "Зогсоолын талбай",
                        value: 5,
                      },
                    ]}
                    //onChange={onChange}
                  />
                </Form.Item>
                <p className="text-[#008cc7] font-semibold">Өрөөний тоо</p>
                <Form.Item name="numOfRoom">
                  <Radio.Group
                    className="pt-2"
                    options={[
                      {
                        label: "1+",
                        value: 1,
                      },
                      {
                        label: "2+",
                        value: 2,
                      },
                      {
                        label: "3+",
                        value: 3,
                      },
                      {
                        label: "4+",
                        value: 4,
                      },
                    ]}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </Form.Item>
                <p className="text-[#008cc7] font-semibold">
                  Хотын төв хүртэлх зай (км)
                </p>
                <Form.Item name="distanceToDowntown">
                  <Radio.Group
                    className="pt-2"
                    options={[
                      {
                        label: "~1",
                        value: 1,
                      },
                      {
                        label: "~3",
                        value: 3,
                      },
                      {
                        label: "~5",
                        value: 5,
                      },
                      {
                        label: "7+",
                        value: 100,
                      },
                    ]}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </Form.Item>
              </div>
              <div className="col-span-1">
                <p className="text-[#008cc7] font-semibold">Талбай</p>
                <Form.Item className="pt-2" name="maxBaseArea">
                  <InputNumber placeholder="Дээд талбай" addonAfter="м.кв" />
                </Form.Item>
                <Form.Item className="-mt-3" name="minBaseArea">
                  <InputNumber placeholder="Доод талбай" addonAfter="м.кв" />
                </Form.Item>
                <p className="text-[#008cc7] font-semibold">Үнэ</p>
                <Form.Item className="pt-2" name="maxTotalAvgPrice">
                  <InputNumber
                    placeholder="Дээд үнэ"
                    addonAfter="₮"
                    formatter={priceFormatter}
                  />
                </Form.Item>
                <Form.Item className="-mt-3" name="minTotalAvgPrice">
                  <InputNumber
                    placeholder="Доод үнэ"
                    addonAfter="₮"
                    formatter={priceFormatter}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Modal>
      )}
      <Modal
        open={modalVisible}
        onCancel={handleCloseModal}
        title="Мэдэгдэл"
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Буцах
          </Button>,
        ]}
      >
        {selectedNotification && (
          <div className="pt-2">
            <div>
              <img src="/images/logoblue.png" width={120} alt="logo"></img>
            </div>
            <div className="flex pt-3">
              <p className="bg-gray-100 p-1 px-2 rounded-lg">
                {selectedNotification.type}
              </p>
            </div>
            <div className="pt-3">{selectedNotification.body}</div>
            <div className="flex items-center pt-2 gap-1 text-[#008cc7]">
              <UserIcon width={21} />
              <p>{selectedNotification.employee}</p>
            </div>
            <div className="flex items-center pt-2 gap-1 pl-1 text-[#008cc7]">
              <DateIcon width={21} />
              <p>{new Date(selectedNotification.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
