"use client";

import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    localStorage.setItem("employeeId", employeeId);
    setLoading(true);
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
        router.push("/app/dashboard");
        console.log("Амжилттай нэвтэрлээ!");
      }
    } catch (error) {
      console.error("Алдаа:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="flex flex-col items-center justify-between p-24 background">
      <div className="text-center bg-transparent backdrop-blur px-24 rounded-3xl mt-8">
        <div className="flex justify-center items-center pt-11">
          <img
            src="/images/logo.png"
            width="150px"
            className="text-center"
          ></img>
        </div>
        {/* <img src="/icons/property.svg" style={{ fill: "blue" }}></img> */}
        {/* <p className="pt-6 text-white text-[15px] font-bold">Нэвтрэх</p> */}
        <div className="pt-12 signin">
          <Form
            layout="vertical"
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
              <Input
                placeholder="Ажилтны нэвтрэх код"
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
              <Input.Password
                placeholder="Нууц үг"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item className="flex justify-center py-5 pb-8">
              <Button
                loading={loading}
                htmlType="submit"
                className="text-[#4882DB] border-[#4882DB] bg-white w-40"
              >
                Нэвтрэх
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      {/* <div onClick={() => signOut()}>
        <p>ГАРИЙЙЛДААА</p>
      </div> */}
      {error && <p className="text-red-500">{error}</p>}
    </main>
  );
}
