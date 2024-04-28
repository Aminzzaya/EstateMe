"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SearchIcon, BellIcon } from "./Icons";
import {
  Button,
  Dropdown,
  Modal,
  Radio,
  Checkbox,
  Form,
  Select,
  InputNumber,
} from "antd";

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [form] = Form.useForm();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const items = [
    {
      key: "1",
      label: "Notification 1",
    },
  ];

  const handleSearch = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
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
          >
            <Button className="w-8 h-8 p-[5px] hover:bg-[#008cc7] text-[#008cc7] rounded-lg border-blue-300">
              <BellIcon />
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
                <Form.Item>
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
                <Form.Item>
                  <Select placeholder="Бүсчлэл" />
                </Form.Item>
                <Form.Item className="-mt-3">
                  <Select placeholder="Хот, аймаг" />
                </Form.Item>
                <Form.Item className="-mt-3">
                  <Select placeholder="Дүүрэг, сум" />
                </Form.Item>
              </div>
              <div className="col-span-1">
                <p className="text-[#008cc7] font-semibold">
                  Үл хөдлөх хөрөнгийн төрөл
                </p>
                <Form.Item>
                  <Checkbox.Group
                    className="pt-2"
                    options={[
                      {
                        label: "Орон сууц",
                        value: "Орон сууц",
                      },
                      {
                        label: "Амины сууц",
                        value: "Амины сууц",
                      },
                      {
                        label: "Пентхаус",
                        value: "Пентхаус",
                      },
                      {
                        label: "Газар",
                        value: "Газар",
                      },
                      {
                        label: "Зогсоолын талбай",
                        value: "Зогсоолын талбай",
                      },
                    ]}
                    defaultValue={["Худалдах"]}
                    //onChange={onChange}
                  />
                </Form.Item>
                <p className="text-[#008cc7] font-semibold">Өрөөний тоо</p>
                <Form.Item>
                  <Radio.Group
                    className="pt-2"
                    options={[
                      {
                        label: "1+",
                        value: "1",
                      },
                      {
                        label: "2+",
                        value: "2",
                      },
                      {
                        label: "3+",
                        value: "3",
                      },
                      {
                        label: "4+",
                        value: "4",
                      },
                    ]}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </Form.Item>
                <p className="text-[#008cc7] font-semibold">
                  Хотын төв хүртэлх зай (км)
                </p>
                <Form.Item>
                  <Radio.Group
                    className="pt-2"
                    options={[
                      {
                        label: "~0.5",
                        value: "1",
                      },
                      {
                        label: "~1.5",
                        value: "2",
                      },
                      {
                        label: "~2.5",
                        value: "3",
                      },
                      {
                        label: "3+",
                        value: "4",
                      },
                    ]}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </Form.Item>
              </div>
              <div className="col-span-1">
                <p className="text-[#008cc7] font-semibold">Талбай</p>
                <Form.Item className="pt-2">
                  <InputNumber placeholder="Дээд талбай" addonAfter="м.кв" />
                </Form.Item>
                <Form.Item className="-mt-3">
                  <InputNumber placeholder="Доод талбай" addonAfter="м.кв" />
                </Form.Item>
                <p className="text-[#008cc7] font-semibold">Үнэ</p>
                <Form.Item className="pt-2">
                  <InputNumber placeholder="Дээд үнэ" addonAfter="₮" />
                </Form.Item>
                <Form.Item className="-mt-3">
                  <InputNumber placeholder="Доод үнэ" addonAfter="₮" />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Modal>
      )}
    </main>
  );
}
