"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SearchIcon, BellIcon } from "./Icons";
import { Button, Dropdown } from "antd";

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      key: "1",
      label: "Мэдэгдлүүд",
    },
  ];

  return (
    <main>
      <ul className="flex gap-3">
        <Button className="h-8 p-[5px] hover:bg-[#008cc7] text-[#008cc7] rounded-lg border-blue-300">
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
    </main>
  );
}
