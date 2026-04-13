import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    if (payload.email) {
      await resend.emails.send({
        from: "booking@duadonsacramento.com",
        to: payload.email,
        subject: "Xác nhận đã nhận yêu cầu đặt xe",
        html: `
          <h2>Chào ${payload.full_name},</h2>
          <p>Bên mình đã nhận được yêu cầu đặt xe của bạn.</p>
          <p><strong>Điểm đón:</strong> ${payload.pickup_location}</p>
          <p><strong>Điểm đến:</strong> ${payload.dropoff_location}</p>
          <p><strong>Ngày:</strong> ${payload.pickup_date}</p>
          <p><strong>Giờ:</strong> ${payload.pickup_time}</p>
          <p>Bên mình sẽ liên hệ sớm để xác nhận lịch trình.</p>
        `,
      });
    }

    if (adminEmail) {
      await resend.emails.send({
        from: "booking@duadonsacramento.com",
        to: adminEmail,
        subject: "New booking received",
        html: `
          <h2>New Booking</h2>
          <p><strong>Name:</strong> ${payload.full_name}</p>
          <p><strong>Phone:</strong> ${payload.phone}</p>
          <p><strong>Email:</strong> ${payload.email || "-"}</p>
          <p><strong>Service:</strong> ${payload.service_type}</p>
          <p><strong>Pickup:</strong> ${payload.pickup_location}</p>
          <p><strong>Dropoff:</strong> ${payload.dropoff_location}</p>
          <p><strong>Date:</strong> ${payload.pickup_date}</p>
          <p><strong>Time:</strong> ${payload.pickup_time}</p>
          <p><strong>Passengers:</strong> ${payload.passengers}</p>
          <p><strong>Luggage:</strong> ${payload.luggage}</p>
          <p><strong>Preferred contact:</strong> ${payload.preferred_contact}</p>
          <p><strong>Notes:</strong> ${payload.notes || "-"}</p>
        `,
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Booking email sent successfully" }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});