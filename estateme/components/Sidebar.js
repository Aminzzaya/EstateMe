"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  PropertyIcon,
  DashboardIcon,
  UserIcon,
  SignOutIcon,
  ReportIcon,
  GearIcon,
  MapIcon,
  LaptopIcon,
} from "./Icons";

export default function Sidebar() {
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();
  const [employeeType, setEmployeeType] = useState([]);
  const [user, setUser] = useState([]);
  const email = session?.data?.user?.email;

  useEffect(() => {
    if (email) {
      getUser();
    }
  }, [email]);

  const getUser = async () => {
    try {
      const response = await fetch("/api/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user[0]);
          localStorage.setItem("user", JSON.stringify(data.user[0]));
          localStorage.setItem("employeeType", data.user[0].employeeType);
          setEmployeeType(data.user[0].employeeType);
        } else {
          console.error("Хэрэглэгчийн дата олдсонгүй:", data.message);
        }
      } else {
        console.error("Алдаа: Хэрэглэгчийн мэдээлэл FE:", response.statusText);
      }
    } catch (error) {
      console.error("Алдаа: Хэрэглэгчийн мэдээлэл BE:", error);
    }
  };

  const handleSignOut = async () => {
    localStorage.clear();
    await signOut();
  };

  return (
    <main className="w-[290px] h-full sidebar">
      {employeeType && (
        <div className="text-center py-12">
          <div
            className="flex justify-center cursor-pointer"
            onClick={() => router.push("/app/dashboard")}
          >
            <img src="/images/logoblue.png" width="160px" alt="Logo"></img>
          </div>
          <div className="flex justify-center pt-10">
            <div className="rounded-full w-28 h-28">
              <img
                src={user.profilePicture || "/images/profile.png"}
                className="profile w-28 h-28"
              />
            </div>
          </div>
          <div className="pt-4">
            <p className="text-[#008cc7]">Тавтай морил</p>
            <div className="leading-4 pt-3 font-medium">
              <p>{user.firstName}</p>
              <p>{user.lastName}</p>
            </div>
          </div>

          <div className="p-12 text-start space-y-4">
            <div
              className={`flex items-center gap-4 cursor-pointer ${
                pathname === "/app/dashboard"
                  ? "text-[#008cc7] font-semibold"
                  : "text-[#6f6f6f] hover:font-medium"
              }`}
              onClick={() => router.push("/app/dashboard")}
            >
              <DashboardIcon />
              Хяналтын самбар
            </div>
            {employeeType == 2 || employeeType == 1 ? (
              <></>
            ) : (
              <>
                <div
                  className={`flex items-center gap-4 cursor-pointer ${
                    pathname === "/app/properties"
                      ? "text-[#008cc7] font-semibold"
                      : "text-[#6f6f6f] hover:font-medium"
                  }`}
                  onClick={() => router.push("/app/properties")}
                >
                  <PropertyIcon />
                  Бүртгэл
                </div>
              </>
            )}
            {employeeType == 3 ? (
              <></>
            ) : (
              <>
            <div
              className={`flex items-center gap-4 cursor-pointer ${
                pathname === "/app/reports"
                  ? "text-[#008cc7] font-semibold"
                  : "text-[#6f6f6f] hover:font-medium"
              }`}
              onClick={() => router.push("/app/reports")}
            >
              <ReportIcon />
              Тайлан
            </div>
            </>
            )}
            {employeeType == 9 && (
              <>
                <div
                  className={`flex items-center gap-4 cursor-pointer ${
                    pathname === "/app/employees"
                      ? "text-[#008cc7] font-semibold"
                      : "text-[#6f6f6f] hover:font-medium"
                  }`}
                  onClick={() => router.push("/app/employees")}
                >
                  <UserIcon />
                  Хэрэглэгч
                </div>
                <div
                  className={`flex items-center gap-4 cursor-pointer ${
                    pathname === "/app/address"
                      ? "text-[#008cc7] font-semibold"
                      : "text-[#6f6f6f] hover:font-medium"
                  }`}
                  onClick={() => router.push("/app/settings")}
                >
                  <MapIcon />
                  Хаягийн мэдээлэл
                </div>
              </>
            )}

            <div
              className={`flex items-center gap-4 cursor-pointer ${
                pathname === "/app/settings"
                  ? "text-[#008cc7] font-semibold"
                  : "text-[#6f6f6f] hover:font-medium"
              }`}
              onClick={() => router.push("/app/settings")}
            >
              <GearIcon />
              Тохиргоо
            </div>
          </div>
          <div
            className="pt-10 cursor-pointer hover:font-medium flex justify-center items-center gap-2 text-[#6f6f6f]"
            onClick={handleSignOut}
          >
            <SignOutIcon />
            <p className="text-[#6f6f6f]">Гарах</p>
          </div>
        </div>
      )}
    </main>
  );
}
