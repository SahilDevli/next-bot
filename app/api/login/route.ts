import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  console.log(body);

  const email = "abc@mail.com";
  const pass = "1234";

  if (
    body.email === email &&
    body.password === pass
  ) {
    return NextResponse.json(
      {
        message: "Login successful",
        userId: body.email,
      },
      {
        status: 200,
      }
    );
  }

  return NextResponse.json(
    {
      message: "Login Failed",
      userId: body.email,
    },
    {
      status: 401,
    }
  );
}