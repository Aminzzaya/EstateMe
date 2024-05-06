"use client";

import React, { useState, useEffect } from "react";
import { Tabs, Divider, Modal, Button } from "antd";
import { DateIcon, BellIcon, UserIcon } from "@/components/Icons";
import Nav from "@/components/Nav";

export default function Dashboard() {
  const [notifications, setNotifications] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const employee = localStorage.getItem("employeeId");
    if (employee) {
      getNotifications(employee);
      setEmployeeId(employee);
    }
  }, []);

  const getNotifications = async (employeeId) => {
    try {
      const response = await fetch("/api/getAllNotifications", {
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

  const unreadNotifications = notifications.filter(
    (notification) => notification.status === 0
  );
  const readNotifications = notifications.filter(
    (notification) => notification.status === 1
  );

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    handleMarkAsRead();
    setModalVisible(false);
    getNotifications(employeeId);
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
      key: "1",
      label: `Бүгд (${notifications.length})`,
      children: (
        <div className="pt-2">
          {notifications.map((notification, index) => (
            <div key={notification.id} className="cursor-pointer">
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
              {index !== notifications.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "2",
      label: `Уншсан (${readNotifications.length})`,
      children: (
        <div className="pt-2">
          {readNotifications.map((notification, index) => (
            <div key={notification.id} className="cursor-pointer">
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
              {index !== readNotifications.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "3",
      label: `Уншаагүй (${unreadNotifications.length})`,
      children: (
        <div className="pt-2">
          {unreadNotifications.map((notification, index) => (
            <div key={notification.id} className="cursor-pointer">
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
              {index !== unreadNotifications.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <main className="px-12 py-8">
      <div className="pt-6 pb-2 flex justify-between">
        <p className="font-semibold text-[15px] text-[#008cc7]">МЭДЭГДЛҮҮД</p>
        <Nav />
      </div>
      <div>
        <Tabs defaultActiveKey="1" items={items} />
      </div>
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
