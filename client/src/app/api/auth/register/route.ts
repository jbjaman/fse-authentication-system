import { registerSchema } from "@/lib/validations/register.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validateData = registerSchema.parse(body);

    // console.log(body);
    console.log(validateData);

    return NextResponse.json({
      message: "Register API Working",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.issues,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
