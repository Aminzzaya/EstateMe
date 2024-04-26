"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  Select,
  message,
  Spin,
  ConfigProvider,
  Table,
  Tooltip,
} from "antd";
import { LaptopIcon, PencilIcon } from "@/components/Icons";
import { LoadingOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { SearchIcon, BellIcon } from "@/components/Icons";
import Nav from "@/components/Nav";

export default function Settings() {
  const [form] = Form.useForm();
  const { Option } = Select;
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);
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
          setUsers(data.user);
          setProfilePreview(data.user[0].profilePicture);
        } else {
          console.error("Хэрэглэгчийн дата олдсонгүй:", data.message);
        }
      } else {
        console.error("Алдаа: Хэрэглэгчийн мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Хэрэглэгчийн мэдээлэл BE:", error);
    } finally {
      setLoading(false);
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

  const handleEditSubmit = async ({ formValues }) => {
    setLoadingBtn(true);
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
          email: formValues.email,
          phoneNumber: formValues.phoneNumber,
          password: formValues.password,
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
      setLoadingBtn(false);
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
          {user.firstName && (
            <>
              <div className="pt-6 pb-4 flex justify-between">
                <p className="font-semibold text-[15px] text-[#008cc7]">
                  МИНИЙ МЭДЭЭЛЭЛ
                </p>
                <Nav />
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
              {/* <div className="inline-flex flex-col">
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
              </div> */}
              <div className="pb-1 pt-6">
                <Table
                  dataSource={users}
                  rowKey="employeeId"
                  pagination={false}
                >
                  <Table.Column
                    title="Ажилтны код"
                    dataIndex="firstName"
                    key="firstName"
                    render={(text, record) => <p>{record.employeeId}</p>}
                  />
                  <Table.Column
                    title="Албан тушаал"
                    dataIndex="employeeTypeName"
                    key="employeeTypeName"
                  />
                  <Table.Column
                    title="Цахим шуудан"
                    dataIndex="email"
                    key="email"
                    align="center"
                  />
                  <Table.Column
                    title="Утасны дугаар"
                    dataIndex="phoneNumber"
                    key="phoneNumber"
                    align="center"
                  />
                  <Table.Column
                    title="Нууц үг"
                    dataIndex="status"
                    key="status"
                    align="center"
                    render={(text, record) => (
                      <Input.Password value={record.password} />
                    )}
                  />
                  <Table.Column
                    title=""
                    dataIndex=""
                    key="action"
                    align="center"
                    render={(text, record) => (
                      <Tooltip title="Мэдээлэл засах">
                        <Button
                          className="text-[#008cc7]"
                          type="link"
                          onClick={() => {
                            setEditModalOpen(true);
                          }}
                        >
                          <PencilIcon />
                        </Button>
                      </Tooltip>
                    )}
                  />
                </Table>
              </div>
            </>
          )}
          <Modal
            title="Мэдээлэл засах"
            open={editModalOpen}
            onCancel={() => setEditModalOpen(false)}
            cancelText="Буцах"
            okText="Хадгалах"
            okButtonProps={{
              style: { backgroundColor: "green" },
              loading: loadingBtn,
            }}
            onOk={() => handleEditSubmit({ formValues: form.getFieldsValue() })}
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
              autoComplete="off"
              initialValues={user}
            >
              <div className="flex flex-wrap">
                <div className="w-full px-2">
                  <Form.Item label="Цахим шуудан" name="email">
                    <Input />
                  </Form.Item>
                </div>
                <div className="w-full px-2">
                  <Form.Item label="Утасны дугаар" name="phoneNumber">
                    <Input />
                  </Form.Item>
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="w-full px-2">
                  <Form.Item label="Нууц үг" name="password">
                    <Input.Password />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Modal>
        </main>
      )}
    </>
  );
}
