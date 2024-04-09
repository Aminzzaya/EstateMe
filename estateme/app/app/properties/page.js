"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  const handleSubmit = async (values) => {
    const {
      employeeId,
      password,
      lastName,
      firstName,
      email,
      phoneNumber,
      employeeType,
    } = values;
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
        }),
      });

      if (response.ok) {
        console.log("OKOKOK");
      } else {
        console.error("Алдаа: Хэрэглэгчийн мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Хэрэглэгчийн мэдээлэл BE:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between p-12">
      <div>
        <p>Тест явжийнөө</p>
        <Form
          layout={"vertical"}
          style={{
            width: 320,
          }}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Ажилтны код"
            name="employeeId"
            rules={[
              {
                required: true,
                message: "Ажилтны кодоо оруулна уу!",
              },
            ]}
          >
            <Input placeholder="Ажилтны нэвтрэх код" />
          </Form.Item>
          <Form.Item
            label="Нууц үг"
            name="password"
            rules={[
              {
                required: true,
                message: "Нууц үгээ оруулна уу!",
              },
            ]}
          >
            <Input.Password placeholder="Нууц үг" />
          </Form.Item>
          <Form.Item
            label="Овог"
            name="lastName"
            rules={[
              {
                required: true,
                message: "Ажилтны кодоо оруулна уу!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Нэр"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Ажилтны кодоо оруулна уу!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="email"
            name="email"
            rules={[
              {
                required: true,
                message: "Ажилтны кодоо оруулна уу!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Утас"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Ажилтны кодоо оруулна уу!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="employeeType"
            name="employeeType"
            rules={[
              {
                required: true,
                message: "Ажилтны кодоо оруулна уу!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item className="flex justify-center py-5 pb-8">
            <Button
              htmlType="submit"
              className="text-[#4882DB] border-[#4882DB] bg-white w-40"
            >
              Бүртгүүлэх
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
