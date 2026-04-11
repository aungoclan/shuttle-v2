const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");

Deno.serve(async (req: Request) => {
  try {
    const payload = await req.json();
    const booking = payload?.record ?? payload;

    const adminHtml = `
<div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 20px;">
    <h2 style="color: #111;">🚗 New Booking Received</h2>
    <hr/>
    <p><strong>👤 Name:</strong> ${booking.full_name}</p>
    <p><strong>📞 Phone:</strong> ${booking.phone}</p>
    <p><strong>📧 Email:</strong> ${booking.email || "-"}</p>
    <hr/>
    <p><strong>🚘 Service:</strong> ${booking.service_type}</p>
    <p><strong>📍 Pickup:</strong> ${booking.pickup_location}</p>
    <p><strong>🏁 Dropoff:</strong> ${booking.dropoff_location}</p>
    <hr/>
    <p><strong>📅 Date:</strong> ${booking.pickup_date}</p>
    <p><strong>⏰ Time:</strong> ${booking.pickup_time}</p>
    <hr/>
    <p><strong>👥 Passengers:</strong> ${booking.passengers}</p>
    <p><strong>🧳 Luggage:</strong> ${booking.luggage}</p>
    <p><strong>📲 Preferred Contact:</strong> ${booking.preferred_contact}</p>
    <hr/>
    <p><strong>💬 Notes:</strong></p>
    <p style="background:#f9f9f9;padding:10px;border-radius:6px;">
      ${booking.notes || "No notes"}
    </p>
    <hr/>
    <p style="font-size:12px;color:gray;">
      Shuttle V2 • Auto notification system
    </p>
  </div>
</div>
`;

    const customerHtml = `
<div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 24px;">
    <h2 style="color: #111; margin-top: 0;">✅ Booking Received</h2>

    <p>Hello ${booking.full_name || "Customer"},</p>

    <p>
      Thank you for your booking request. We have received your trip details and will review your request shortly.
    </p>

    <div style="background:#f8fafc;padding:16px;border-radius:10px;border:1px solid #e5e7eb;">
      <p><strong>Service:</strong> ${booking.service_type}</p>
      <p><strong>Pickup:</strong> ${booking.pickup_location}</p>
      <p><strong>Dropoff:</strong> ${booking.dropoff_location}</p>
      <p><strong>Date:</strong> ${booking.pickup_date}</p>
      <p><strong>Time:</strong> ${booking.pickup_time}</p>
      <p><strong>Passengers:</strong> ${booking.passengers}</p>
      <p><strong>Luggage:</strong> ${booking.luggage}</p>
    </div>

    <p style="margin-top:20px;">
      If anything needs to be updated, please contact us directly.
    </p>

    <p style="margin-top:24px;">
      Best regards,<br/>
      <strong>Shuttle Booking</strong>
    </p>

    <hr style="margin:24px 0;" />

    <p style="font-size:12px;color:gray;">
      This is an automated confirmation email.
    </p>
  </div>
</div>
`;

    async function sendEmail(to: string[], subject: string, html: string) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Shuttle Booking <onboarding@resend.dev>",
          to,
          subject,
          html,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(`Resend error: ${JSON.stringify(data)}`);
      }

      return data;
    }

    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    if (!ADMIN_EMAIL) {
      throw new Error("Missing ADMIN_EMAIL");
    }

    const results: Record<string, unknown> = {};

    results.admin = await sendEmail(
      [ADMIN_EMAIL],
      `New Booking: ${booking.full_name || "Customer"}`,
      adminHtml
    );

    if (booking.email && String(booking.email).trim()) {
      results.customer = await sendEmail(
        [booking.email],
        "We received your booking request",
        customerHtml
      );
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});