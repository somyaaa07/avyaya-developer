
import { NextResponse } from "next/server";
import { sendContactEnquiryEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    const form = await request.json();

    const {
      name,
      phone,
      email,
      enquiryType,
      message,
    } = form;

    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, phone and message are required.",
        },
        { status: 400 }
      );
    }

    await sendContactEnquiryEmail({
      enquiry: {
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || "",
        enquiryType: enquiryType?.trim() || "",
        message: message.trim(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact enquiry error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send enquiry. Please try again.",
      },
      { status: 500 }
    );
  }
}
