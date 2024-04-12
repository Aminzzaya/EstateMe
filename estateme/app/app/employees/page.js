"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal, Select, message } from "antd";
import { PencilIcon, LaptopIcon } from "@/components/Icons";

export default function Dashboard() {
  const { Option } = Select;
  const [form] = Form.useForm();

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [status, setStatus] = useState("Идэвхтэй");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    form.setFieldsValue(selectedEmployee);
  }, [selectedEmployee]);

  const getUsers = async () => {
    try {
      const response = await fetch("/api/getUsers");
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees);
        const maxEmployeeId = findMaxEmployeeId(data.employees);
        const nextEmployeeId = getNextEmployeeId(maxEmployeeId);
        setEmployeeId(nextEmployeeId);
      } else {
        console.error("Алдаа: Хэрэглэгчийн мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Хэрэглэгчийн мэдээлэл BE:", error);
    }
  };

  const findMaxEmployeeId = (employees) => {
    const numericIds = employees.map((employee) => {
      return parseInt(employee.employeeId.replace(/[^\d]/g, ""), 10);
    });
    return Math.max(...numericIds);
  };

  const getNextEmployeeId = (maxEmployeeId) => {
    const nextId = maxEmployeeId + 1;
    return `E${nextId.toString().padStart(3, "0")}`;
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

  const handleSubmit = async (values) => {
    const { password, lastName, firstName, email, phoneNumber, employeeType } =
      values;
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          password,
          lastName,
          firstName,
          email,
          phoneNumber,
          employeeType,
          status,
          profilePicture,
        }),
      });

      if (response.ok) {
        message.success("Амжилттай бүртгэлээ.");
        setRegisterModalOpen(false);
        getUsers();
      } else {
        console.error("Алдаа: Хэрэглэгчийн мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Хэрэглэгчийн мэдээлэл BE:", error);
    }
  };

  const handleEdit = (employee) => {
    setEditModalOpen(true);
    setSelectedEmployee(employee);
  };

  const handleEditSubmit = async (values) => {
    const { status, email, phoneNumber, employeeType } = values;
    try {
      const response = await fetch("/api/updateUserStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: selectedEmployee.employeeId,
          email,
          phoneNumber,
          employeeType,
          status,
        }),
      });

      if (response.ok) {
        message.success("Амжилттай шинэчлэгдлээ.");
        setEditModalOpen(false);
        getUsers();
      } else {
        console.error("Алдаа: Хэрэглэгчийн мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Хэрэглэгчийн мэдээлэл BE:", error);
    }
  };

  return (
    <main className="px-12 py-8">
      <div className="pt-5">
        <Button
          className="border-[#008cc7] text-[#008cc7]"
          onClick={() => setRegisterModalOpen(true)}
        >
          + Ажилтан бүртгэх
        </Button>
      </div>
      <div className="pt-6 pb-4">
        <p className="font-semibold text-[15px] text-[#008cc7]">
          АЖИЛЧДЫН ЖАГСААЛТ
        </p>
      </div>
      <div className="page-content pt-6 pb-1">
        <div className="grid grid-cols-12 gap-8 px-6">
          <div className="col-span-2">
            <p className="font-medium">Овог, нэр</p>
          </div>
          <div className="col-span-2">
            <p className="font-medium">Албан тушаал</p>
          </div>
          <div className="col-span-3">
            <p className="font-medium text-center">И-мейл</p>
          </div>
          <div className="col-span-2">
            <p className="font-medium text-center">Утасны дугаар</p>
          </div>
          <div className="col-span-2">
            <p className="font-medium text-center">Төлөв</p>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-center"></p>
          </div>
        </div>
        <div className="border-b border-1 pt-4"></div>
        <div className="grid grid-cols-12 gap-4 pt-4 items-center">
          {employees.map((employee, index) => (
            <div key={employee.employeeId} className="col-span-12">
              <div className="grid grid-cols-12 gap-8 items-center px-6 pb-3">
                <div className="col-span-2 flex items-center">
                  <div className="w-[35px] h-[35px]">
                    <img
                      src={employee.profilePicture || "/images/profile.png"}
                      alt="Agent"
                      className="profile w-[35px] h-[35px]"
                    />
                  </div>

                  <p className="pl-4">
                    {employee.firstName} {employee.lastName.slice(0, 1)}.
                  </p>
                </div>
                <div className="col-span-2">
                  <p>{employee.employeeType}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-center">{employee.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-center">{employee.phoneNumber}</p>
                </div>
                <div className="flex justify-center col-span-2">
                  <p
                    className={`p-1 px-3 rounded-lg text-center ${
                      employee.status === "Идэвхтэй"
                        ? "bg-[#008cc7] text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {employee.status}
                  </p>
                </div>
                <div
                  className="flex justify-center col-span-1 text-[#008cc7] bg-gray-100 rounded-lg py-1 cursor-pointer"
                  onClick={() => handleEdit(employee)}
                >
                  <PencilIcon />
                </div>
              </div>
              {index !== employees.length - 1 && (
                <div className="border-b border-1"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Modal
        title="Ажилтны бүртгэл"
        open={registerModalOpen}
        onCancel={() => setRegisterModalOpen(false)}
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

        <div className="flex justify-center pt-4">
          <p>
            Үүсгэсэн ажилтны код:{" "}
            <span className="font-semibold">{employeeId}</span>
          </p>
        </div>

        <Form
          className="pt-4"
          layout={"vertical"}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <div className="flex flex-wrap">
            <div className="w-1/2 px-2">
              <Form.Item
                label="Овог"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: "Утга оруулна уу!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="w-1/2 px-2">
              <Form.Item
                label="Нэр"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "Утга оруулна уу!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-1/2 px-2">
              <Form.Item
                label="И-мейл"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Утга оруулна уу!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="w-1/2 px-2">
              <Form.Item
                label="Утасны дугаар"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Утга оруулна уу!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-1/2 px-2">
              <Form.Item
                label="Албан тушаал"
                name="employeeType"
                rules={[
                  {
                    required: true,
                    message: "Сонголт хийнэ үү!",
                  },
                ]}
              >
                <Select placeholder="Сонгох">
                  <Option value="2">Менежер</Option>
                  <Option value="3">Мэргэжилтэн</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="w-1/2 px-2">
              <Form.Item
                label="Нууц үг"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Утга оруулна уу!",
                  },
                ]}
              >
                <Input.Password placeholder="Нууц үг" />
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-end px-2 pt-2">
            <Form.Item>
              <Button onClick={() => setRegisterModalOpen(false)}>Буцах</Button>
              <Button
                className="border-white bg-green-600 text-white ml-2"
                htmlType="submit"
              >
                Хадгалах
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
      {selectedEmployee && (
        <Modal
          title="Мэдээлэл засах"
          open={editModalOpen}
          onCancel={() => setEditModalOpen(false)}
          footer={null}
        >
          <div className="flex justify-center">
            <div className="border rounded-full w-28 h-28">
              <img
                src={selectedEmployee.profilePicture || "/images/profile.png"}
                className="profile w-28 h-28"
              ></img>
            </div>
          </div>
          <p className="text-center pt-4">
            <span className="font-semibold">{selectedEmployee.firstName}</span>{" "}
            {selectedEmployee.lastName}
          </p>
          <div className="flex justify-center items-center gap-2">
            <div className="pt-2 text-[#008cc7]">
              <LaptopIcon />
            </div>

            <p className="mt-2 text-center px-2 rounded-lg py-1 bg-[#008cc7] text-white">
              {selectedEmployee.employeeType}
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <p>
              Ажилтны код:{" "}
              <span className="font-semibold">
                {selectedEmployee.employeeId}
              </span>
            </p>
          </div>

          <Form
            form={form}
            className="pt-4"
            layout={"vertical"}
            onFinish={handleEditSubmit}
            autoComplete="off"
            initialValues={selectedEmployee}
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
                <Form.Item label="Албан тушаал" name="employeeType">
                  <Select placeholder="Сонгох">
                    <Option value="2">Менежер</Option>
                    <Option value="3">Мэргэжилтэн</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="w-1/2 px-2">
                <Form.Item label="Төлөв" name="status">
                  <Select>
                    <Option value="Идэвхтэй">Идэвхтэй</Option>
                    <Option value="Идэвхгүй">Идэвхгүй</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="flex justify-end px-2 pt-2">
              <Form.Item>
                <Button onClick={() => setEditModalOpen(false)}>Буцах</Button>
                <Button
                  className="border-white bg-green-600 text-white ml-2"
                  htmlType="submit"
                >
                  Хадгалах
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>
      )}
    </main>
  );
}
