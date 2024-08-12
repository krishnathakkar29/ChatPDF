import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;

    console.log(file_key, file_name);
    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.log("Error in chat route", error);

    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
