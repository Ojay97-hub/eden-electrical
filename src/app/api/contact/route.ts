import { NextResponse } from "next/server";
import { z } from "zod";
import {
  canWriteToSanity,
  createSanityEnquiry,
} from "@/sanity/lib/writeClient";

const contactSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    phone: z.string().trim().optional().default(""),
    email: z.string().trim().optional().default(""),
    service: z.string().trim().optional().default(""),
    message: z.string().trim().optional().default(""),
    estimate: z.string().trim().optional().default(""),
  })
  .refine(
    (d) => d.phone.length > 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email),
    { message: "Provide a phone number or a valid email", path: ["email"] }
  );

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  const data = parsed.data;

  if (canWriteToSanity) {
    try {
      await createSanityEnquiry(data);
    } catch (err) {
      console.error("Sanity enquiry write failed:", err);
      return NextResponse.json(
        { error: "Could not save enquiry right now" },
        { status: 502 }
      );
    }
  }

  // Email delivery. Wire a provider (e.g. Resend) here; until a key is set we
  // log the enquiry so nothing is lost in development.
  if (process.env.RESEND_API_KEY) {
    try {
      await sendViaResend(data);
    } catch (err) {
      console.error("Contact email failed:", err);
      return NextResponse.json(
        { error: "Could not send right now" },
        { status: 502 }
      );
    }
  } else {
    console.info("📨 New contact enquiry (no email provider configured):", data);
  }

  return NextResponse.json({ ok: true });
}

async function sendViaResend(data: {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  estimate: string;
}) {
  const to = process.env.CONTACT_TO_EMAIL ?? "contact@eden-electrical.com";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Eden Electrical <contact@eden-electrical.com>",
      to: [to],
      reply_to: data.email || undefined,
      subject: `Website enquiry — ${data.service || "General"}`,
      text: [
        `Name: ${data.name}`,
        `Phone: ${data.phone || "—"}`,
        `Email: ${data.email || "—"}`,
        `Service: ${data.service || "—"}`,
        "",
        data.message || "(no message)",
        ...(data.estimate ? ["", "— — —", data.estimate] : []),
      ].join("\n"),
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}
