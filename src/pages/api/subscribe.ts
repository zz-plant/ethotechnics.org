import type { APIRoute } from "astro";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBSCRIBERS: Array<{ email: string; subscribedAt: string }> = [];

export const POST: APIRoute = async ({ request }) => {
  let email: string;
  try {
    const body: Record<string, unknown> = await request.json();
    const rawEmail = typeof body.email === "string" ? body.email : "";
    email = rawEmail.trim();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ error: "Valid email required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const entry = { email: email.toLowerCase(), subscribedAt: new Date().toISOString() };
  SUBSCRIBERS.push(entry);
   
  console.warn("newsletter:subscribe", JSON.stringify(entry));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
