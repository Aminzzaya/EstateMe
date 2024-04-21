"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal, Select, message } from "antd";
import { PencilIcon, BellIcon, SearchIcon } from "@/components/Icons";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { Option } = Select;
  const [form] = Form.useForm();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

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

  return (
    <main className="px-12 py-8">
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
            onClick={() => router.push("properties/new")}
          >
            + Үл хөдлөх хөрөнгө бүртгэх
          </Button>
        </div>
      </div>
      <div className="pt-6"></div>
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
                  <img
                    src={employee.profilePicture || "/images/profile.png"}
                    alt="Agent"
                    className="profile w-9 h-9"
                  />

                  <p className="pl-4">
                    {employee.firstName} {employee.lastName.slice(0, 1)}.
                  </p>
                </div>
                <div className="col-span-2">
                  <p>{employee.employeeTypeName}</p>
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
    </main>
  );
}
