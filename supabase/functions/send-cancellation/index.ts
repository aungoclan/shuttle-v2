import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend";

const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";
const resend = new Resend(resendApiKey);
const adminEmail = Deno.env.get("ADMIN_EMAIL") ?? "";
const fromEmail = Deno.env.get("FROM_EMAIL") ?? "Sacramento Shuttle <booking@duadonsacramento.com>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function buildCustomerHtml(payload: Record<string, unknown>) {
  const fullName = escapeHtml(payload.full_name || "Customer");
  const bookingCode = escapeHtml(payload.booking_code || "-");
  const serviceType = escapeHtml(payload.service_type || "-");
  const pickupLocation = escapeHtml(payload.pickup_location || "-");
  const dropoffLocation = escapeHtml(payload.dropoff_location || "-");
  const pickupDate = formatDate(String(payload.pickup_date || ""));
  const pickupTime = escapeHtml(payload.pickup_time || "-");
  const phone = escapeHtml(payload.phone || "-");

  return `
    <div style="font-family: Arial, sans-serif; background:#f6f8fb; padding:24px; color:#111827;">
      <div style="max-width:680px; margin:0 auto; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #e5e7eb;">
        <div style="background:#7f1d1d; color:#ffffff; padding:28px;">
          <div style="font-size:24px; font-weight:800;">Sacramento Shuttle</div>
          <div style="font-size:14px; opacity:0.9; margin-top:8px;">Airport transfers & private rides</div>
        </div>

        <div style="padding:30px 28px;">
          <div style="display:inline-block; background:#fef2f2; color:#b91c1c; padding:8px 12px; border-radius:999px; font-size:12px; font-weight:800; letter-spacing:0.04em; border:1px solid #fecaca;">
            BOOKING CANCELLED
          </div>

          <h2 style="margin:18px 0 12px; font-size:28px; color:#111827;">Your ride has been cancelled</h2>

          <p style="margin:0 0 16px; font-size:15px; line-height:1.7;">
            Hello <strong>${fullName}</strong>,
          </p>

          <p style="margin:0 0 16px; font-size:15px; line-height:1.7;">
            We’re sorry, but your scheduled ride has been cancelled. Please review the trip reference and details below.
          </p>

          <div style="margin:20px 0; background:#111827; color:#ffffff; border-radius:16px; padding:18px 20px;">
            <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.08em; opacity:0.75;">Booking code</div>
            <div style="margin-top:8px; font-size:24px; font-weight:800; letter-spacing:0.06em;">${bookingCode}</div>
          </div>

          <div style="background:#f8fafc; border:1px solid #e5e7eb; border-radius:16px; padding:20px; margin-top:18px;">
            <div style="font-size:17px; font-weight:800; margin-bottom:14px; color:#111827;">Cancelled trip details</div>
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr><td style="padding:8px 0; color:#6b7280; width:180px;">Service</td><td style="padding:8px 0; color:#111827;">${serviceType}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Pickup</td><td style="padding:8px 0; color:#111827;">${pickupLocation}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Dropoff</td><td style="padding:8px 0; color:#111827;">${dropoffLocation}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Date</td><td style="padding:8px 0; color:#111827;">${pickupDate}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Time</td><td style="padding:8px 0; color:#111827;">${pickupTime}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Contact phone</td><td style="padding:8px 0; color:#111827;">${phone}</td></tr>
            </table>
          </div>

          <div style="margin-top:20px; background:#fff7ed; border:1px solid #fdba74; color:#9a3412; border-radius:14px; padding:14px 16px; font-size:14px; line-height:1.7;">
            If you would like to request a new ride or need assistance, please reply to this email or contact us directly.
          </div>

          <div style="margin-top:22px; padding-top:18px; border-top:1px solid #e5e7eb; font-size:14px; color:#6b7280; line-height:1.7;">
            <div><strong style="color:#111827;">Sacramento Shuttle</strong></div>
            <div>Private rides & airport transportation</div>
            <div>Reply to: aungoclan@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildAdminHtml(payload: Record<string, unknown>) {
  const fullName = escapeHtml(payload.full_name || "Customer");
  const bookingCode = escapeHtml(payload.booking_code || "-");
  const email = escapeHtml(payload.email || "-");
  const pickupDate = formatDate(String(payload.pickup_date || ""));
  const pickupTime = escapeHtml(payload.pickup_time || "-");

  return `
    <div style="font-family: Arial, sans-serif; background:#f6f8fb; padding:24px; color:#111827;">
      <div style="max-width:680px; margin:0 auto; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #e5e7eb;">
        <div style="background:#7f1d1d; color:#ffffff; padding:26px 28px;">
          <div style="font-size:23px; font-weight:800;">Cancellation sent</div>
          <div style="font-size:14px; opacity:0.9; margin-top:8px;">Admin notification</div>
        </div>

        <div style="padding:28px;">
          <table style="width:100%; border-collapse:collapse; font-size:14px;">
            <tr><td style="padding:10px 0; color:#6b7280; width:180px;">Booking code</td><td style="padding:10px 0; color:#111827;"><strong>${bookingCode}</strong></td></tr>
            <tr><td style="padding:10px 0; color:#6b7280;">Customer</td><td style="padding:10px 0; color:#111827;">${fullName}</td></tr>
            <tr><td style="padding:10px 0; color:#6b7280;">Email</td><td style="padding:10px 0; color:#111827;">${email}</td></tr>
            <tr><td style="padding:10px 0; color:#6b7280;">Ride date</td><td style="padding:10px 0; color:#111827;">${pickupDate}</td></tr>
            <tr><td style="padding:10px 0; color:#6b7280;">Ride time</td><td style="padding:10px 0; color:#111827;">${pickupTime}</td></tr>
          </table>
        </div>
      </div>
    </div>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }

  try {
    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY");
    }

    const payload = await req.json();
    const email = String(payload?.email ?? "").trim();

    if (!email) {
      return new Response(JSON.stringify({ success: false, error: "Missing customer email" }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const subjectCode = String(payload?.booking_code ?? "").trim();
    const subject = subjectCode
      ? `Booking Cancelled - ${subjectCode}`
      : "Your ride has been cancelled - Sacramento Shuttle";

    const customerResult = await resend.emails.send({
      from: fromEmail,
      replyTo: "aungoclan@gmail.com",
      to: email,
      subject,
      html: buildCustomerHtml(payload),
    });

    if (adminEmail) {
      await resend.emails.send({
        from: fromEmail,
        replyTo: "aungoclan@gmail.com",
        to: adminEmail,
        subject: `Cancellation Sent - ${String(payload?.booking_code ?? payload?.full_name ?? "Booking")}`,
        html: buildAdminHtml(payload),
      });
    }

    return new Response(JSON.stringify({ success: true, id: customerResult.data?.id ?? null }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("send-cancellation error =", error);

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
      },
    );
  }
});
