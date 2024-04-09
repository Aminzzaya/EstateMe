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

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div>
        <p>Тавтай морил</p>
        <p>{session?.data?.user.email}</p>
        <Button onClick={() => signOut()}>Гарах</Button>
      </div>
    </main>
  );
}
