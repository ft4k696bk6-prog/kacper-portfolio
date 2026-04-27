import { Resend } from "resend";

function getResendClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

export async function sendContactEmail(params: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL;
  if (!recipient) throw new Error("CONTACT_RECIPIENT_EMAIL is not set");

  const resend = getResendClient();
  await resend.emails.send({
    from: "Contact Form <noreply@sagan.dev>",
    to: [recipient],
    replyTo: params.email,
    subject: `New message from ${params.name}`,
    text: [
      `Name: ${params.name}`,
      `Email: ${params.email}`,
      ``,
      `Message:`,
      params.message,
    ].join("\n"),
  });
}
