import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  try {
    const { name, email, pickup, dropoff, date } = await req.json();

    await resend.emails.send({
      from: "booking@duadonsacramento.com",
      to: email,
      subject: "🚗 Booking Confirmed",
      html: `
        <h2>Hi ${name}</h2>
        <p>Your ride is confirmed.</p>
        <p><b>Pickup:</b> ${pickup}</p>
        <p><b>Dropoff:</b> ${dropoff}</p>
        <p><b>Date:</b> ${date}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err }), {
      status: 500,
    });
  }
});