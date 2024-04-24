"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
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
  message,
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
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [ownerRegNo, setOwnerRegNo] = useState(null);
  const [ownerExists, setOwnerExists] = useState(false);
  const [type, setType] = useState(0);
  const [propertyId, setPropertyId] = useState(0);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [streets, setStreets] = useState([]);
  const [certificate, setCertificate] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const employee = JSON.parse(localStorage.getItem("user"));
    setPropertyId(localStorage.getItem("propertyId"));
    if (employee) {
      setEmployee(employee);
    }
    getCities();
  }, []);

  const getCities = async () => {
    try {
      const response = await fetch("/api/getCities");
      if (response.ok) {
        const data = await response.json();
        setCities(data.cities);
      } else {
        console.error("Алдаа: Хотын мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Хотын мэдээлэл BE:", error);
    }
  };

  const handleCitySelect = (value) => {
    getDistrict(value);
  };

  const getDistrict = async (cityId) => {
    try {
      const response = await fetch("/api/getDistrict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cityId }),
      });
      if (response.ok) {
        const data = await response.json();
        setDistricts(data.district);
      } else {
        console.error("Алдаа: Дүүргийн мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Дүүргийн мэдээлэл BE:", error);
    }
  };

  const handleDistrictSelect = (value) => {
    getStreet(value);
  };

  const getStreet = async (districtId) => {
    try {
      const response = await fetch("/api/getStreet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ districtId }),
      });
      if (response.ok) {
        const data = await response.json();
        setStreets(data.street);
      } else {
        console.error("Алдаа: Хорооны мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Хорооны мэдээлэл BE:", error);
    }
  };

  const handleInputChange = (e) => {
    setOwnerRegNo(e.target.value);
  };

  const getOwnerInfo = () => {
    getOwnerByRegNo();
  };

  const getOwnerByRegNo = async () => {
    try {
      const response = await fetch("/api/getOwnerByRegNo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ownerRegNo }),
      });
      if (response.ok) {
        const data = await response.json();
        form.setFieldsValue({
          firstName: data.owner.firstName,
          lastName: data.owner.lastName,
          phoneNumber: data.owner.phoneNumber,
          email: data.owner.email,
          gender: data.owner.gender,
        });
        setOwnerExists(true);
        message.success("Эзэмшигчийн мэдээлэл олдлоо.");
      } else {
        message.warning("Эзэмшигч бүртгэлгүй байна.");
        setOwnerExists(false);
      }
    } catch (error) {
      console.error("Алдаа: Эзэмшигчийн мэдээлэл BE:", error);
    }
  };

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

  const onTypeSelect = async (values) => {
    if (values == 4) {
      setType(1);
    } else if (values == 5) {
      setType(1);
    } else {
      setType(0);
    }
  };

  const handleFinish = async (values) => {
    try {
      await form.validateFields();

      const newFormData = { ...formData, ...values };
      setFormData(newFormData);

      if (current !== 4) {
        setCurrent(current + 1);
      }
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
        setSelectedImages(newSelectedImages.slice(0, 4));
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const onCertificateChange = (event) => {
    const file = event.target.files[0];
    setCertificate(file);
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages(
      selectedImages.filter((image, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const imageUrls = [];

      for (let i = 0; i < selectedImages.length; i++) {
        const formData = new FormData();
        formData.append("file", selectedImages[i]);
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
        const imageUrl = cloudinaryData.secure_url;
        imageUrls.push(imageUrl);
      }

      const certificateFormData = new FormData();
      certificateFormData.append("file", certificate);
      certificateFormData.append("upload_preset", "ml_default");

      const certificateCloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/estateme/image/upload",
        {
          method: "POST",
          body: certificateFormData,
        }
      );

      if (!certificateCloudinaryResponse.ok) {
        console.error("Failed to upload certificate to Cloudinary");
        return;
      }

      const certificateCloudinaryData =
        await certificateCloudinaryResponse.json();
      const certificateUrl = certificateCloudinaryData.secure_url;

      const response = await fetch("/api/newProperty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: propertyId,
          employeeId: employee.employeeId,
          typeId: formData.typeId,
          statusId: "1",
          ownerRegNo: formData.registerNumber,
          certificate: certificateUrl,
          zipCode: formData.zipCode,
          regionId: formData.regionId,
          cityId: formData.cityId,
          districtId: formData.districtId,
          streetId: formData.streetId,
          buildingName: formData.buildingName,
          buildingTotalFloor: formData.buildingTotalFloor,
          apartmentFloor: formData.apartmentFloor,
          buildingMaterial: formData.buildingMaterial,
          buildingNumOfCCTV: formData.buildingNumOfCCTV,
          commencementDate: formData.commencementDate,
          launchDate: formData.launchDate,
          unitMaxPrice: formData.unitMaxPrice,
          totalMaxPrice: formData.totalMaxPrice,
          unitMinPrice: formData.unitMinPrice,
          totalMinPrice: formData.totalMinPrice,
          unitAvgPrice: formData.unitAvgPrice,
          totalAvgPrice: formData.totalAvgPrice,
          ceilingHeight: formData.ceilingHeight,
          baseArea: formData.baseArea,
          numOfRoom: formData.numOfRoom,
          numOfBedroom: formData.numOfBedroom,
          numOfBathroom: formData.numOfBathroom,
          numOfGarage: formData.numOfGarage,
          garagePrice: formData.garagePrice,
          numOfEntry: formData.numOfEntry,
          numOfExit: formData.numOfExit,
          numOfWindow: formData.numOfWindow,
          isCentralWaterSupplies: formData.isCentralWaterSupplies,
          isLobby: formData.isLobby,
          isAdditionalPowerSupplies: formData.isAdditionalPowerSupplies,
          isParkingLot: formData.isParkingLot,
          isEmergencyExit: formData.isEmergencyExit,
          earthquakeResistance: formData.earthquakeResistance,
          distanceToDowntown: formData.distanceToDowntown,
          distanceToSchool: formData.distanceToSchool,
          distanceToUniversity: formData.distanceToUniversity,
          distanceToKindergarten: formData.distanceToKindergarten,
          usage: formData.usage,
          purpose: formData.purpose,
          pics: imageUrls,
          otherInfo: formData.otherInfo,
        }),
      });

      if (!ownerExists) {
        const ownerResponse = await fetch("/api/newOwner", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            ownerRegNo: formData.registerNumber,
            gender: formData.gender,
            email: formData.email,
          }),
        });
      }

      if (response.ok) {
        message.success("Амжилттай бүртгэгдлээ.");
        router.push("/app/properties");
      } else {
        console.error(
          "Алдаа: Үл хөдлөх хөрөнгийн мэдээлэл FE:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Алдаа: Үл хөдлөх хөрөнгийн мэдээлэл BE:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-12 py-8">
      <Form
        layout={"vertical"}
        onFinish={handleFinish}
        autoComplete="off"
        form={form}
      >
        <div className="pt-6 pb-5 flex gap-4">
          <div
            className="rounded-lg p-1 cursor-pointer border border-[#008cc7] -mt-1 btn-back"
            onClick={() => router.back()}
          >
            <BackIcon />
          </div>

          <p className="font-semibold text-[15px] text-[#008cc7]">
            ШИНЭ ҮЛ ХӨДЛӨХ ХӨРӨНГИЙН БҮРТГЭЛ
          </p>
        </div>
        <div>
          <div className="flex gap-24 px-16">
            <div className="flex-1">
              <Form.Item label="ҮХХ-ийн дугаар">
                <div className="pr">{propertyId}</div>
              </Form.Item>
            </div>
            <div className="w-1/7">
              <Form.Item label="Огноо">
                <div className="pr">{date}</div>
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Зорилго"
                name="purpose"
                rules={[
                  {
                    required: true,
                    message: "Утга оруулна уу!",
                  },
                ]}
              >
                <Select placeholder="Сонгох" style={{ width: "160px" }}>
                  <Option value="Худалдах">Худалдах</Option>
                  <Option value="Түрээслүүлэх">Түрээслүүлэх</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="flex-1">
              <Form.Item
                label="Төрөл"
                name="typeId"
                rules={[
                  {
                    required: true,
                    message: "Төрөл сонгоно уу!",
                  },
                ]}
              >
                <Select
                  placeholder="Сонгох"
                  style={{ width: "180px" }}
                  onChange={onTypeSelect}
                >
                  <Option value="1">Орон сууц</Option>
                  <Option value="2">Амины сууц</Option>
                  <Option value="3">Пентхаус</Option>
                  <Option value="4">Газар</Option>
                  <Option value="5">Зогсоолын талбай</Option>
                </Select>
              </Form.Item>
            </div>
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
            <div className="page-content p-6 px-12 pt-8">
              <div className="flex gap-4">
                <div className="w-1/4 px-2">
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
                    <Input maxLength={10} onChange={handleInputChange} />
                  </Form.Item>
                </div>
                <div className="flex items-center pt-1">
                  <Button
                    className="text-white bg-[#008cc7] border-none"
                    onClick={getOwnerInfo}
                  >
                    <SearchIcon />
                  </Button>
                </div>
              </div>
              <div className="border-b border-1 mb-6"></div>
              <div className="flex flex-wrap">
                <div className="w-1/2 px-2">
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
                <div className="w-1/2 px-2">
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
              </div>
              <div className="w-full px-2">
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
              <div className="w-full px-2">
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
              <div className="w-full px-2">
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
              <div className="flex flex-wrap">
                <div className="w-full px-2">
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
                      <Option value="1">Монгол</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className="flex flex-wrap">
              <div className="w-1/4 px-2">
                <Form.Item
                  labelCol={{ span: 19 }}
                  label="Хот, аймаг"
                  name="cityId"
                  rules={[
                    {
                      required: true,
                      message: "Утга оруулна уу!",
                    },
                  ]}
                >
                  <Select placeholder="Сонгох" onChange={handleCitySelect}>
                    {cities.map((city) => (
                      <Option key={city.cityId} value={city.cityId}>
                        {city.cityName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="w-1/4 px-2">
                <Form.Item
                  labelCol={{ span: 19 }}
                  label="Дүүрэг, сум"
                  name="districtId"
                  rules={[
                    {
                      required: true,
                      message: "Утга оруулна уу!",
                    },
                  ]}
                >
                  <Select placeholder="Сонгох" onChange={handleDistrictSelect}>
                    {districts.map((district) => (
                      <Option
                        key={district.districtId}
                        value={district.districtId}
                      >
                        {district.districtName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="w-1/4 px-2">
                <Form.Item
                  labelCol={{ span: 19 }}
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
                    {streets.map((street) => (
                      <Option key={street.streetId} value={street.streetId}>
                        {street.streetName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="w-1/4 px-2">
                <Form.Item
                  labelCol={{ span: 19 }}
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

              <p className="flex justify-center font-semibold pb-5">
                МАРШРУТ ХООРОНДЫН ЗАЙ
              </p>
              <div className="flex flex-wrap">
                <div className="w-1/2 px-24">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Хотын төв"
                    name="distanceToDowntown"
                  >
                    <InputNumber min={0} placeholder="0" addonAfter="км" />
                  </Form.Item>
                </div>
                <div className="w-1/2 px-24">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Хамгийн ойр сургууль"
                    name="distanceToSchool"
                  >
                    <InputNumber min={0} placeholder="0" addonAfter="км" />
                  </Form.Item>
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="w-1/2 px-24">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Хамгийн ойр их сургууль"
                    name="distanceToUniversity"
                  >
                    <InputNumber min={0} placeholder="0" addonAfter="км" />
                  </Form.Item>
                </div>
                <div className="w-1/2 px-24">
                  <Form.Item
                    labelCol={{ span: 19 }}
                    label="Хамгийн ойр цэцэрлэг"
                    name="distanceToKindergarten"
                  >
                   <InputNumber min={0} placeholder="0" addonAfter="км" />
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
              {type == 0 ? (
                <>
                  <div className="flex flex-wrap">
                    <div className="w-full px-2">
                      <Form.Item
                        labelCol={{ span: 25 }}
                        label="Барилгын нэр/Барилгын дугаар"
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
                  </div>

                  <div className="border-b border-1 mb-6"></div>
                  <div className="flex flex-wrap">
                    <p className="w-1/3 font-semibold pb-5">Огноо:</p>
                    <p className="w-1/3 font-semibold pb-5">Барилгын давхар:</p>
                    <p className="w-1/3 font-semibold pb-5">ҮХХ хэмжээ:</p>
                  </div>

                  <div className="flex flex-wrap items-center">
                    <div className="w-1/3 px-2">
                      <Form.Item
                        labelCol={{ span: 19 }}
                        label="Баригдсан"
                        name="commencementDate"
                      >
                        <DatePicker placeholder="Сонгох" />
                      </Form.Item>
                    </div>
                    <div className="w-1/3 px-2">
                      <Form.Item
                        labelCol={{ span: 19 }}
                        wrapperCol={{ span: 14 }}
                        label="Нийт"
                        name="buildingTotalFloor"
                        rules={[
                          {
                            required: true,
                            message: " ",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="0"
                          addonAfter="давхар"
                        />
                      </Form.Item>
                    </div>
                    <div className="w-1/3 px-2">
                      <Form.Item
                        labelCol={{ span: 12 }}
                        label="Нийт талбай"
                        name="baseArea"
                        rules={[
                          {
                            required: true,
                            message: "Утга оруулна уу!",
                          },
                        ]}
                      >
                        <InputNumber min={0} placeholder="0" addonAfter="мкв" />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center">
                    <div className="w-1/3 px-2">
                      <Form.Item
                        labelCol={{ span: 19 }}
                        label="Ашиглалтад орсон"
                        name="launchDate"
                      >
                        <DatePicker placeholder="Сонгох" />
                      </Form.Item>
                    </div>
                    <div className="w-1/3 px-2">
                      <Form.Item
                        labelCol={{ span: 19 }}
                        wrapperCol={{ span: 14 }}
                        label="ҮХХ"
                        name="apartmentFloor"
                        rules={[
                          {
                            required: true,
                            message: " ",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          placeholder="0"
                          addonAfter="давхар"
                        />
                      </Form.Item>
                    </div>
                    <div className="w-1/3 px-2">
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
                        <InputNumber min={0} placeholder="0" addonAfter="м" />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="border-b border-1 mb-6"></div>

                  <div className="flex flex-wrap items-center">
                    <div className="w-full px-2">
                      <Form.Item
                        labelCol={{ span: 12 }}
                        label="Барилгын материал"
                        name="buildingMaterial"
                      >
                        <Input />
                      </Form.Item>
                    </div>
                    <div className="w-full px-2">
                      <Form.Item
                        labelCol={{ span: 17 }}
                        label="Газар хөдлөлтийн тэсвэр"
                        name="earthquakeResistance"
                      >
                        <InputNumber
                          min={0}
                          placeholder="0"
                          addonAfter="магнитуд"
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="border-b border-1 mb-6"></div>

                  <div className="flex flex-wrap">
                    <p className="w-1/4 font-semibold pb-5">Өрөөний тоо:</p>
                    <p className="w-1/4 font-semibold pb-5">Орц гарцын тоо:</p>
                    <p className="w-1/4 font-semibold pb-5">Бусад:</p>
                    <p className="w-1/4 font-semibold pb-5">
                      Дотор машины зогсоол:
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center">
                    <div className="w-1/4 px-2">
                      <Form.Item
                        labelCol={{ span: 19 }}
                        label="Нийт"
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
                    <div className="w-1/4 px-2">
                      <Form.Item
                        labelCol={{ span: 19 }}
                        label="Орц"
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
                    <div className="w-1/4 px-2">
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
                    <div className="w-1/4 px-2">
                      <Form.Item
                        labelCol={{ span: 19 }}
                        label="Зогсоолын тоо"
                        name="numOfGarage"
                      >
                        <InputNumber min={0} placeholder="0" />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center">
                    <div className="w-1/4 px-2">
                      <Form.Item
                        labelCol={{ span: 19 }}
                        label="Унтлагын өрөө"
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
                    <div className="w-1/4 px-2">
                      <Form.Item
                        labelCol={{ span: 19 }}
                        label="Гарц"
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
                    <div className="w-1/4 px-2">
                      <Form.Item
                        labelCol={{ span: 19 }}
                        label="Барилгын CCTV тоо"
                        name="buildingNumOfCCTV"
                      >
                        <InputNumber min={0} />
                      </Form.Item>
                    </div>
                    <div className="w-1/4 px-2">
                      <Form.Item
                        labelCol={{ span: 15 }}
                        label="Зогсоолын үнэ"
                        name="garagePrice"
                      >
                        <InputNumber min={0} formatter={priceFormatter} placeholder="0" addonAfter="₮" />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center">
                    <div className="w-1/4 px-2">
                      <Form.Item
                        labelCol={{ span: 19 }}
                        label="Угаалгын өрөө"
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
                  <div className="border-b border-1 mb-6"></div>
                  <div className="grid grid-cols-2 gap-12 pr-14">
                    <div className="col-span-1">
                      <Form.Item
                        labelCol={{ span: 20 }}
                        name="isCentralWaterSupplies"
                        valuePropName="checked"
                        initialValue={false}
                      >
                        <div className="flex items-center">
                          <Checkbox />
                          <span className="pl-3">
                            Төвийн шугамд холбогдсон эсэх
                          </span>
                        </div>
                      </Form.Item>
                    </div>
                    <div className="col-span-1">
                      <Form.Item
                        labelCol={{ span: 15 }}
                        name="isLobby"
                        valuePropName="checked"
                        initialValue={false}
                      >
                        <div className="flex items-center">
                          <Checkbox />
                          <span className="pl-3">
                            Хүлээлгийн танхимтай эсэх
                          </span>
                        </div>
                      </Form.Item>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-12 pr-14">
                    <div className="col-span-1">
                      <Form.Item
                        labelCol={{ span: 20 }}
                        name="isAdditionalPowerSupplies"
                        valuePropName="checked"
                        initialValue={false}
                      >
                        <div className="flex items-center">
                          <Checkbox />
                          <span className="pl-3">
                            Нэмэлт цахилгааны эх үүсвэртэй эсэх
                          </span>
                        </div>
                      </Form.Item>
                    </div>
                    <div className="col-span-1">
                      <Form.Item
                        labelCol={{ span: 15 }}
                        name="isEmergencyExit"
                        valuePropName="checked"
                        initialValue={false}
                      >
                        <div className="flex items-center">
                          <Checkbox />
                          <span className="pl-3">Аваарын гарцтай эсэх</span>
                        </div>
                      </Form.Item>
                    </div>
                  </div>
                  <Form.Item
                    labelCol={{ span: 9 }}
                    name="isParkingLot"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <div className="flex items-center">
                      <Checkbox />
                      <span className="pl-3">Гадна машины зогсоолтой эсэх</span>
                    </div>
                  </Form.Item>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-12 pr-24">
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
                        labelCol={{ span: 12 }}
                        label="Зориулалт"
                        name="usage"
                        rules={[
                          {
                            required: true,
                            message: "Утга оруулна уу!",
                          },
                        ]}
                      >
                        <Select>
                          <Option value="Зуслан">Зуслан</Option>
                          <Option value="Үйчилгээ">Үйчилгээ</Option>
                          <Option value="Амралтын газар">Амралтын газар</Option>
                          <Option value="Газар тариалан">Газар тариалан</Option>
                          <Option value="Мал аж ахуй">Мал аж ахуй</Option>
                          <Option value="Бэлчээр">Бэлчээр</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                  <div className="border-b border-1 mb-6"></div>
                  <div className="grid grid-cols-2 gap-12 pr-14">
                    <div className="col-span-1">
                    <Form.Item
                        labelCol={{ span: 20 }}
                        name="isCentralWaterSupplies"
                        valuePropName="checked"
                        initialValue={false}
                      >
                        <div className="flex items-center">
                          <Checkbox />
                          <span className="pl-3">
                            Төвийн шугамд холбогдсон эсэх
                          </span>
                        </div>
                      </Form.Item>
                    </div>
                    <div className="col-span-1">
                    <Form.Item
                        labelCol={{ span: 20 }}
                        name="isAdditionalPowerSupplies"
                        valuePropName="checked"
                        initialValue={false}
                      >
                        <div className="flex items-center">
                          <Checkbox />
                          <span className="pl-3">
                            Цахилгааны эх үүсвэртэй эсэх
                          </span>
                        </div>
                      </Form.Item>
                    </div>
                  </div>
                </>
              )}

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
              <div className="grid grid-cols-2 gap-12 pr-14 justify-items-center">
                <div className="col-span-1">
                  <p className="flex justify-center font-semibold pb-5">
                    1 м.кв
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
                  <p className="flex justify-center font-semibold pb-5">Нийт</p>
                  <Form.Item
                    labelCol={{ span: 15 }}
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
              <div className="grid grid-cols-2 gap-12 pr-14 justify-items-center">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 15 }}
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
                    labelCol={{ span: 15 }}
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
              <div className="grid grid-cols-2 gap-12 pr-14 justify-items-center">
                <div className="col-span-1">
                  <Form.Item
                    labelCol={{ span: 15 }}
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
                    labelCol={{ span: 15 }}
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
              
              <div className="grid grid-cols-5 pt-2 pb-6 gap-6">
              <p className="flex items-center font-medium">Зураг хавсаргах</p>
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
              <Form.Item
                //labelCol={{ span: 10 }}
                label="Гэрчилгээ хавсаргах"
                name="certificate"
              >
                <div className="bg-gray-100 p-2 mx-16 rounded-lg">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={onCertificateChange}
                  />
                </div>
              </Form.Item>
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
                  loading={loading}
                  htmlType="submit"
                  className="text-white bg-green-600 border-none ant-btn-submit"
                  onClick={handleSubmit}
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
