"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { SearchIcon, BellIcon } from "@/components/Icons";

export default function Dashboard() {
  return (
    <main className="px-12 py-8">
      <div className="pt-6 pb-4 flex justify-between">
        <p className="font-semibold text-[15px] text-[#008cc7]">ТАЙЛАН</p>
        <div className="flex gap-3">
          <div className="w-8 h-8 p-[5px] bg-[#008cc7] text-white rounded-lg">
            <SearchIcon />
          </div>
          <div className="w-8 h-8 p-[5px] bg-[#008cc7] text-white rounded-lg">
            <BellIcon />
          </div>
        </div>
      </div>
      <div className="page-content py-6">
        <div className="grid grid-cols-10 gap-8 px-6">
          <div className="col-span-1">
            <p className="font-medium">Агент</p>
          </div>
          <div className="col-span-3">
            <p className="font-medium text-center">
              Үл хөдлөх хөрөнгийн дугаар
            </p>
          </div>
          <div className="col-span-2">
            <p className="font-medium text-center">Төрөл</p>
          </div>
          <div className="col-span-2">
            <p className="font-medium text-center">Байршил</p>
          </div>
          <div className="col-span-2">
            <p className="font-medium text-center">Төлөв</p>
          </div>
        </div>
        <div className="border-b border-1 pt-4"></div>
        <div className="grid grid-cols-10 gap-8 px-6 pt-4 items-center">
          <div className="col-span-2 flex items-center">
            <img src="/images/profile.png" width="24px"></img>
            <p className="pl-4">Бадрал Н.</p>
          </div>
          <div className="col-span-2">
            <p>PR0673</p>
          </div>
          <div className="col-span-2">
            <p className="text-center">Орон сууц</p>
          </div>
          <div className="col-span-2">
            <p className="text-center">Улаанбаатар</p>
          </div>
          <div className="flex justify-center col-span-2">
            <p className="bg-[#008cc7] text-white p-1 px-3 rounded-lg text-center">
              Хүлээгдэж байгаа
            </p>
          </div>
        </div>
        <div className="border-b border-1 pt-4"></div>
        <div className="grid grid-cols-10 gap-8 px-6 pt-4 items-center">
          <div className="col-span-2 flex items-center">
            <img src="/images/profile.png" width="24px"></img>
            <p className="pl-4">Аминзаяа Ц.</p>
          </div>
          <div className="col-span-2">
            <p>PR0673</p>
          </div>
          <div className="col-span-2">
            <p className="text-center">Газар</p>
          </div>
          <div className="col-span-2">
            <p className="text-center">Дархан</p>
          </div>
          <div className="flex justify-center col-span-2">
            <p className="bg-[#CA4B3D] text-white p-1 px-3 rounded-lg text-center">
              Цуцалсан
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
