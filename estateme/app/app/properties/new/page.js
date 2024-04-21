"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  List,
  InputNumber,
  Select,
  Steps,
  DatePicker,
  Checkbox,
} from "antd";
import { BackIcon, SearchIcon } from "@/components/Icons";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export default function Dashboard() {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { TextArea } = Input;
  const router = useRouter();
  const today = dayjs();
  const date = today.format("YYYY-MM-DD");

  const [current, setCurrent] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [formData, setFormData] = useState({});

  const data = [
    {
      title: "ЭЗЭМШИГЧИЙН МЭДЭЭЛЭЛ",
      current: 0,
    },
    {
      title: "БАЙРШИЛ",
      current: 1,
    },
    {
      title: "ҮЛ ХӨДЛӨХ ХӨРӨНГИЙН ҮНДСЭН МЭДЭЭЛЭЛ",
      current: 2,
    },
    {
      title: "ҮНИЙН МЭДЭЭЛЭЛ",
      current: 3,
    },
    {
      title: "БУСАД",
      current: 4,
    },
  ];

  const items = [
    {
      title: "Эзэмшигч",
    },
    {
      title: "Байршил",
    },
    {
      title: "ҮХХ",
    },
    {
      title: "Үнэ",
    },
    {
      title: "Бусад",
    },
  ];

  const handleFinish = async (values) => {
    try {
      await form.validateFields();

      const newFormData = { ...formData, ...values };
      setFormData(newFormData);

      if (current !== 4) {
        setCurrent(current + 1);
      } else {
        console.log("finish");
      }

      console.log("Form values:", newFormData);
    } catch (errorInfo) {
      console.log("Validation failed:", errorInfo);
    }
  };

  const priceFormatter = (value) => {
    if (!value) return "";
    const formattedValue = value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedValue}`;
  };

  const setMaxPrice = (value) => {
    const baseArea = form.getFieldValue("baseArea");

    const totalMaxPrice = value * baseArea;

    form.setFieldsValue({
      totalMaxPrice,
    });
  };

  const setMinPrice = (value) => {
    const baseArea = form.getFieldValue("baseArea");
    const maxPrice = form.getFieldValue("unitMaxPrice");

    const totalMinPrice = value * baseArea;
    const unitAvgPrice = (value + maxPrice) / 2;
    const totalAvgPrice = unitAvgPrice * baseArea;

    form.setFieldsValue({
      totalMinPrice,
      unitAvgPrice,
      totalAvgPrice,
    });
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newSelectedImages = [...selectedImages];

    if (!newSelectedImages || !Array.isArray(newSelectedImages)) {
      setSelectedImages([]);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onloadend = () => {
        newSelectedImages.push(reader.result);
        setSelectedImages(newSelectedImages.slice(0, 4)); // Limit to 4 images
      };

      if (file) {
        reader.readAsDataURL(file); // Read the image file as a data URL
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages(
      selectedImages.filter((image, index) => index !== indexToRemove)
    );
  };

  return (
    <main className="px-12 py-8">
      <Form onFinish={handleFinish} autoComplete="off" form={form}>
        <div className="pt-6 pb-5 flex gap-4">
          <div
            className="rounded-lg p-1 cursor-pointer border border-[#008cc7] -mt-1"
            onClick={() => router.back()}
          >
            <BackIcon />
          </div>

          <p className="font-semibold text-[15px] text-[#008cc7]">
            ШИНЭ ҮЛ ХӨДЛӨХ ХӨРӨНГИЙН БҮРТГЭЛ
          </p>
        </div>
        <div>
          <div className="flex gap-12">
            <Form.Item label="№">
              <div className="pr">PR0001</div>
            </Form.Item>
            <Form.Item label="Огноо">
              <div className="pr">{date}</div>
            </Form.Item>
            <Form.Item
              label="Төрөл"
              name="typeId"
              rules={[
                {
                  required: true,
                  message: "Утга оруулна уу!",
                },
              ]}
            >
              <Select placeholder="Сонгох" style={{ width: "160px" }}>
                <Option value="1">Орон сууц</Option>
              </Select>
            </Form.Item>
          </div>
          <div>
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item) => {
                if (item.current === current) {
                  return (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <p className="font-semibold text-[#008cc7]">
                            {item.title}
                          </p>
                        }
                      />
                      <Steps
                        style={{ marginTop: 8 }}
                        type="inline"
                        current={item.current}
                        items={items}
                      />
                    </List.Item>
                  );
                } else {
                  return null;
                }
              }}
            />
          </div>
          {current == 0 && (
            <div className="page-content p-6 px-10 pt-8">
              <div className="flex gap-4">
                <Form.Item
                  label="Регистрийн дугаар"
                  name="registerNumber"
                  rules={[
                    {
                      required: true,
                      message: "Утга оруулна уу!",
                    },
                  ]}
                >
                  <Input maxLength={10} />
                </Form.Item>
                <Button className="text-white bg-[#008cc7] border-none">
                  <SearchIcon />
                </Button>
              </div>
              <div className="border-b border-1 mb-6"></div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
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
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="Утасны дугаар"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Утга оруулна уу!",
                      },
                    ]}
                  >
                    <Input maxLength={8} />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
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
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="И-мейл"
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: "Зөв и-мейл оруулна уу!",
                      },
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
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="Хүйс"
                    name="gender"
                    rules={[
                      {
                        required: true,
                        message: "Сонголт хийнэ үү!",
                      },
                    ]}
                  >
                    <Select placeholder="Сонгох">
                      <Option value="Эрэгтэй">Эрэгтэй</Option>
                      <Option value="Эмэгтэй">Эмэгтэй</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className="border-b border-1 mb-6"></div>
              <div className="flex justify-center">
                <Button
                  htmlType="submit"
                  className="text-white bg-[#008cc7] border-none"
                  //onClick={() => setCurrent(current + 1)}
                >
                  Үргэлжлүүлэх
                </Button>
              </div>
            </div>
          )}
          {current == 1 && (
            <div className="page-content p-6 px-10 pt-8">
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="Бүсчлэл"
                    name="regionId"
                    rules={[
                      {
                        required: true,
                        message: "Утга оруулна уу!",
                      },
                    ]}
                  >
                    <Select placeholder="Сонгох">
                      <Option value="Эрэгтэй">Эрэгтэй</Option>
                      <Option value="Эмэгтэй">Эмэгтэй</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Хотын төв хүртэлх зай"
                    name="distanceToDowntown"
                  >
                    <Input addonAfter="км" />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="Хот, аймаг"
                    name="cityId"
                    rules={[
                      {
                        required: true,
                        message: "Утга оруулна уу!",
                      },
                    ]}
                  >
                    <Select placeholder="Сонгох">
                      <Option value="Эрэгтэй">Эрэгтэй</Option>
                      <Option value="Эмэгтэй">Эмэгтэй</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Хамгийн ойр сургууль хүртэлх зай"
                    name="distanceToSchool"
                  >
                    <Input addonAfter="км" />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="Дүүрэг, сум"
                    name="districtId"
                    rules={[
                      {
                        required: true,
                        message: "Утга оруулна уу!",
                      },
                    ]}
                  >
                    <Select placeholder="Сонгох">
                      <Option value="Эрэгтэй">Эрэгтэй</Option>
                      <Option value="Эмэгтэй">Эмэгтэй</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Хамгийн ойр их сургууль хүртэлх зай"
                    name="distanceToUniversity"
                  >
                    <Input addonAfter="км" />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="Хороо, баг"
                    name="streetId"
                    rules={[
                      {
                        required: true,
                        message: "Утга оруулна уу!",
                      },
                    ]}
                  >
                    <Select placeholder="Сонгох">
                      <Option value="Эрэгтэй">Эрэгтэй</Option>
                      <Option value="Эмэгтэй">Эмэгтэй</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Хамгийн ойр цэцэрлэг хүртэлх зай"
                    name="distanceToKindergarten"
                  >
                    <Input addonAfter="км" />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="Зип код"
                    name="zipCode"
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
              <div className="border-b border-1 mb-6"></div>
              <div className="flex justify-center gap-4">
                <Button onClick={() => setCurrent(current - 1)}>Буцах</Button>
                <Button
                  htmlType="submit"
                  className="text-white bg-[#008cc7] border-none"
                  //onClick={() => setCurrent(current + 1)}
                >
                  Үргэлжлүүлэх
                </Button>
              </div>
            </div>
          )}
          {current == 2 && (
            <div className="page-content p-6 px-10 pt-8">
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 12 }}
                    label="Барилгын нэр"
                    name="buildingName"
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
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Нийт өрөөний тоо"
                    name="numOfRoom"
                    rules={[
                      {
                        required: true,
                        message: " ",
                      },
                    ]}
                  >
                    <InputNumber min={0} placeholder="0" />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 2 }}
                    label="Барилгын нийт давхар"
                    name="buildingTotalFloor"
                    rules={[
                      {
                        required: true,
                        message: " ",
                      },
                    ]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Унтлагын өрөөний тоо"
                    name="numOfBedroom"
                    rules={[
                      {
                        required: true,
                        message: " ",
                      },
                    ]}
                  >
                    <InputNumber min={0} placeholder="0" />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 2 }}
                    label="ҮХХ-ийн давхар"
                    name="apartmentFloor"
                    rules={[
                      {
                        required: true,
                        message: " ",
                      },
                    ]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Угаалгын өрөөний тоо"
                    name="numOfBathroom"
                    rules={[
                      {
                        required: true,
                        message: " ",
                      },
                    ]}
                  >
                    <InputNumber min={0} placeholder="0" />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 12 }}
                    label="Баригдсан огноо"
                    name="commencementDate"
                  >
                    <DatePicker placeholder="Сонгох" />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Цонхны тоо"
                    name="numOfWindow"
                    rules={[
                      {
                        required: true,
                        message: " ",
                      },
                    ]}
                  >
                    <InputNumber min={0} placeholder="0" />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 12 }}
                    label="Ашиглалтад орсон огноо"
                    name="launchDate"
                  >
                    <DatePicker placeholder="Сонгох" />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Орцын тоо"
                    name="numOfEntry"
                    rules={[
                      {
                        required: true,
                        message: " ",
                      },
                    ]}
                  >
                    <InputNumber min={0} placeholder="0" />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 12 }}
                    label="Барилгын материал"
                    name="buildingMaterial"
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Гарцын тоо"
                    name="numOfExit"
                    rules={[
                      {
                        required: true,
                        message: " ",
                      },
                    ]}
                  >
                    <InputNumber min={0} placeholder="0" />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 12 }}
                    label="Талбайн хэмжээ"
                    name="baseArea"
                    rules={[
                      {
                        required: true,
                        message: "Утга оруулна уу!",
                      },
                    ]}
                  >
                    <InputNumber min={0} addonAfter="мкв" />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Дотор машин зогсоолын тоо"
                    name="numOfGarage"
                  >
                    <InputNumber min={0} placeholder="0" />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 12 }}
                    label="Таазны өндөр"
                    name="ceilingHeight"
                    rules={[
                      {
                        required: true,
                        message: "Утга оруулна уу!",
                      },
                    ]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 15 }}
                    label="Дотор машин зогсоолын үнэ"
                    name="garagePrice"
                  >
                    <InputNumber min={0} placeholder="0" addonAfter="₮" />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 12 }}
                    label="Барилгын CCTV тоо"
                    name="buildingNumOfCCTV"
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 17 }}
                    label="Газар хөдлөлтийн тэсвэр"
                    name="earthquakeResistance"
                  >
                    <InputNumber min={0} placeholder="0" addonAfter="мт" />
                  </Form.Item>
                </div>
              </div>
              <div className="border-b border-1 mb-6"></div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 20 }}
                    label="Төвийн шугамд холбогдсон эсэх"
                    name="isCentralWaterSupplies"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Checkbox />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 15 }}
                    label="Хүлээлгийн танхимтай эсэх"
                    name="isLobby"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Checkbox />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 20 }}
                    label="Нэмэлт цахилгааны эх үүсвэртэй эсэх"
                    name="isAdditionalPowerSupplies"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Checkbox />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 15 }}
                    label="Аваарын гарцтай эсэх"
                    name="isEmergencyExit"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Checkbox />
                  </Form.Item>
                </div>
              </div>
              <Form.Item
                labelCol={{ span: 9 }}
                label="Гадна машины зогсоолтой эсэх"
                name="isParkingLot"
                valuePropName="checked"
                initialValue={false}
              >
                <Checkbox />
              </Form.Item>
              <div className="border-b border-1 mb-6"></div>
              <div className="flex justify-center gap-4">
                <Button onClick={() => setCurrent(current - 1)}>Буцах</Button>
                <Button
                  htmlType="submit"
                  className="text-white bg-[#008cc7] border-none"
                  //onClick={() => setCurrent(current + 1)}
                >
                  Үргэлжлүүлэх
                </Button>
              </div>
            </div>
          )}
          {current == 3 && (
            <div className="page-content p-6 px-10 pt-8">
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <p className="flex justify-center font-semibold pb-5">
                    1 М.КВ
                  </p>
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="Дээд үнэ"
                    name="unitMaxPrice"
                    rules={[
                      {
                        required: true,
                        message: "Утга оруулна уу!",
                      },
                    ]}
                  >
                    <InputNumber
                      addonAfter="₮"
                      onChange={setMaxPrice}
                      formatter={priceFormatter}
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <p className="flex justify-center font-semibold pb-5">НИЙТ</p>
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="Дээд үнэ"
                    name="totalMaxPrice"
                  >
                    <InputNumber
                      addonAfter="₮"
                      disabled
                      formatter={priceFormatter}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="Доод үнэ"
                    name="unitMinPrice"
                    rules={[
                      {
                        required: true,
                        message: "Утга оруулна уу!",
                      },
                    ]}
                  >
                    <InputNumber
                      addonAfter="₮"
                      onChange={setMinPrice}
                      formatter={priceFormatter}
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="Доод үнэ"
                    name="totalMinPrice"
                  >
                    <InputNumber
                      addonAfter="₮"
                      disabled
                      formatter={priceFormatter}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12 pr-14">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="Дундаж үнэ"
                    name="unitAvgPrice"
                  >
                    <InputNumber
                      addonAfter="₮"
                      disabled
                      formatter={priceFormatter}
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 10 }}
                    label="Дундаж үнэ"
                    name="totalAvgPrice"
                  >
                    <InputNumber
                      addonAfter="₮"
                      disabled
                      formatter={priceFormatter}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="border-b border-1 mb-6"></div>
              <div className="flex justify-center gap-4">
                <Button onClick={() => setCurrent(current - 1)}>Буцах</Button>
                <Button
                  htmlType="submit"
                  className="text-white bg-[#008cc7] border-none"
                  //onClick={() => setCurrent(current + 1)}
                >
                  Үргэлжлүүлэх
                </Button>
              </div>
            </div>
          )}
          {current == 4 && (
            <div className="page-content p-6 px-10 pt-8">
              <p>Зураг хавсаргах</p>
              <div className="grid grid-cols-5 pt-2 pb-6 gap-6">
                {selectedImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative border border-dashed rounded-lg h-52"
                  >
                    <img
                      src={image}
                      alt={`Selected ${index + 1}`}
                      className="max-h-full max-w-full"
                    />
                    <button
                      className="absolute top-1 right-1 bg-gray-400 rounded-full p-1"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                {selectedImages.length < 4 && (
                  <label htmlFor="fileInput">
                    <div className="border border-dashed rounded-lg h-52 flex justify-center items-center cursor-pointer">
                      <p className="text-3xl text-gray-400">+</p>
                    </div>
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      multiple
                    />
                  </label>
                )}
              </div>
              <div className="border-b border-1 mb-6"></div>
              <Form.Item
                //labelCol={{ span: 10 }}
                label="Нэмэлт мэдээлэл"
                name="otherInfo"
              >
                <TextArea rows={3} />
              </Form.Item>
              <div className="border-b border-1 mb-6"></div>
              <div className="flex justify-center gap-4">
                <Button onClick={() => setCurrent(current - 1)}>Буцах</Button>
                <Button
                  htmlType="submit"
                  className="text-white bg-green-600 border-none"
                  //onClick={() => setCurrent(current + 1)}
                >
                  Хадгалах
                </Button>
              </div>
            </div>
          )}
        </div>
      </Form>
    </main>
  );
}
