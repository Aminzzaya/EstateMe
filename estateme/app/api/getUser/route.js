import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Employees from "@/model/employees";

export async function POST(req) {
  try {
    const { email } = await req.json();

    await connectMongo();

    const user = await Employees.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Хэрэглэгч олдсонгүй." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Хэрэглэгчийн мэдээлэл олдсон.", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Хэрэглэгчийн мэдээлэл буцаахад алдаа гарлаа." },
      { status: 500 }
    );
  }
}
