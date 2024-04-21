"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal, Select, message } from "antd";
import { LaptopIcon } from "@/components/Icons";
import { useSession } from "next-auth/react";
import { SearchIcon, BellIcon } from "@/components/Icons";

export default function Settings() {
  const [form] = Form.useForm();
  const { Option } = Select;
  const session = useSession();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const email = session?.data?.user?.email;

  useEffect(() => {
    if (email) {
      getUser();
    }
  }, [email]);

  const getUser = async () => {
    try {
      const response = await fetch("/api/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.user) {
          setUser(data.user[0]);
          setProfilePreview(data.user[0].profilePicture);
        } else {
          console.error("Хэрэглэгчийн дата олдсонгүй:", data.message);
        }
      } else {
        console.error("Алдаа: Хэрэглэгчийн мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Хэрэглэгчийн мэдээлэл BE:", error);
    }
  };

  const onProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setProfilePreview(reader.result);
          setProfilePicture(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (values) => {
    setLoading(true);
    const { email, phoneNumber, password } = values;
    try {
      let pictureUrl = profilePreview;

      if (profilePicture) {
        const formData = new FormData();
        formData.append("file", profilePicture);
        formData.append("upload_preset", "ml_default");

        const cloudinaryResponse = await fetch(
          "https://api.cloudinary.com/v1_1/estateme/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!cloudinaryResponse.ok) {
          console.error("Failed to upload image to Cloudinary");
          return;
        }

        const cloudinaryData = await cloudinaryResponse.json();
        pictureUrl = cloudinaryData.secure_url;
      }

      const response = await fetch("/api/updateUserInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: user.employeeId,
          email,
          phoneNumber,
          password,
          profilePicture: pictureUrl,
        }),
      });

      if (response.ok) {
        message.success("Амжилттай шинэчлэгдлээ.");
        setEditModalOpen(false);
        getUser();
      } else {
        console.error("Алдаа: Хэрэглэгчийн мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Хэрэглэгчийн мэдээлэл BE:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-12 py-8">
      {user.firstName && (
        <>
          <div className="pt-6 pb-4 flex justify-between">
            <p className="font-semibold text-[15px] text-[#008cc7]">
              МИНИЙ МЭДЭЭЛЭЛ
            </p>
            <div className="flex gap-3">
              <div className="w-8 h-8 p-[5px] bg-[#008cc7] text-white rounded-lg">
                <SearchIcon />
              </div>
              <div className="w-8 h-8 p-[5px] bg-[#008cc7] text-white rounded-lg">
                <BellIcon />
              </div>
            </div>
          </div>
          <div className="flex gap-8 items-center">
            <div>
              <img
                src={user.profilePicture || "/images/profile.png"}
                className="profile w-40 h-40"
              ></img>
            </div>
            <div>
              <p className="font-bold text-[#008cc7] text-lg">
                {user.firstName.toUpperCase()}
              </p>
              <p>{user.lastName}</p>
              <div className="flex items-center gap-2">
                <div className="pt-2 text-[#008cc7]">
                  <LaptopIcon />
                </div>
                <p className="mt-2 text-center px-2 rounded-lg py-1 bg-[#008cc7] text-white">
                  {user.employeeTypeName}
                </p>
              </div>
            </div>
          </div>
          <div className="inline-flex flex-col">
            <div className="page-content-sm mt-6 p-4 px-6">
              <div className="grid grid-cols-6 gap-7">
                <div className="col-span-2">
                  <p>Ажилтны код:</p>
                </div>
                <div className="col-span-4">
                  <p>{user.employeeId}</p>
                </div>
              </div>
              <div className="border-b border-1 pt-4"></div>
              <div className="grid grid-cols-6 gap-7 pt-4">
                <div className="col-span-2">
                  <p>И-мейл:</p>
                </div>
                <div className="col-span-4">
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="border-b border-1 pt-4"></div>
              <div className="grid grid-cols-6 gap-7 pt-4">
                <div className="col-span-2">
                  <p>Утасны дугаар:</p>
                </div>
                <div className="col-span-4">
                  <p>{user.phoneNumber}</p>
                </div>
              </div>
              <div className="border-b border-1 pt-4"></div>
              <div className="grid grid-cols-6 gap-7 pt-4">
                <div className="col-span-2">
                  <p>Нууц үг:</p>
                </div>
                <div className="col-span-4 -mt-1">
                  <Input.Password value={user.password} />
                </div>
              </div>
            </div>
            <div className="pt-6 justify-center flex">
              <Button
                className="bg-[#008cc7] border-none text-white"
                onClick={() => setEditModalOpen(true)}
              >
                Мэдээлэл засах
              </Button>
            </div>
          </div>
        </>
      )}
      <Modal
        title="Мэдээлэл засах"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
      >
        <div className="flex justify-center">
          <div className="border rounded-full w-28 h-28">
            <img src={profilePreview} className="profile w-28 h-28"></img>
          </div>
        </div>
        <div className="bg-gray-100 p-2 mx-16 mt-3 rounded-lg">
          <input type="file" accept="image/*" onChange={onProfileChange} />
        </div>
        <Form
          form={form}
          className="pt-4"
          layout={"vertical"}
          onFinish={handleEditSubmit}
          autoComplete="off"
          initialValues={user}
        >
          <div className="flex flex-wrap">
            <div className="w-1/2 px-2">
              <Form.Item label="И-мейл" name="email">
                <Input />
              </Form.Item>
            </div>
            <div className="w-1/2 px-2">
              <Form.Item label="Утасны дугаар" name="phoneNumber">
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-1/2 px-2">
              <Form.Item label="Нууц үг" name="password">
                <Input.Password />
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-end px-2 pt-2">
            <Form.Item>
              <Button onClick={() => setEditModalOpen(false)}>Буцах</Button>
              <Button
                loading={loading}
                className="border-white bg-green-600 text-white ml-2"
                htmlType="submit"
              >
                Хадгалах
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </main>
  );
}
