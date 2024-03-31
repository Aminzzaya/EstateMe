"use client";

import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const result = await signIn("credentials", {
        employeeId,
        password,
        redirect: false,
      });

      if (result?.error) {
        message.error({
          content: "Ажилтны код эсвэл нууц үг буруу байна!",
          duration: 1.5,
        });
      } else {
        router.push("/dashboard");
        console.log("Амжилттай нэвтэрлээ!");
      }
    } catch (error) {
      console.error("Алдаа:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between p-24 background">
      <div className="text-center bg-transparent backdrop-blur px-24 rounded-3xl mt-8">
      <div className="flex justify-center items-center pt-8">
        <img src="/images/logo.png" width="150px" className="text-center"></img>
      </div>
      <p className="pt-6 text-white text-xl">Нэвтрэх</p>
      <div className="pt-4">
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
            <Input placeholder="Ажилтны нэвтрэх код"
              onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
            />
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
            <Input.Password placeholder="Нууц үг" onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>
          <Form.Item className="flex justify-center py-5">
            <Button
              htmlType="submit"
              className="text-[#4882DB] border-[#4882DB] bg-white w-40"
            >
              Нэвтрэх
            </Button>
          </Form.Item>
        </Form>
      </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </main>
  );
}

