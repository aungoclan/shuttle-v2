import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend";

const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";
const resend = new Resend(resendApiKey);
const adminEmail = Deno.env.get("ADMIN_EMAIL") ?? "";
const fromEmail = Deno.env.get("FROM_EMAIL")?.trim() || "Sacramento Shuttle <booking@duadonsacramento.com>";
const replyToEmail = Deno.env.get("ADMIN_EMAIL")?.trim() || "aungoclan@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

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

function formatMoney(value: unknown) {
  if (value === null || value === undefined) return "-";
  const raw = String(value).trim();
  if (!raw) return "-";
  return `$${escapeHtml(raw)}`;
}

function buildCustomerHtml(payload: Record<string, unknown>) {
  const fullName = escapeHtml(payload.full_name || "Customer");
  const bookingCode = escapeHtml(payload.booking_code || "-");
  const serviceType = escapeHtml(payload.service_type || "-");
  const pickupLocation = escapeHtml(payload.pickup_location || "-");
  const dropoffLocation = escapeHtml(payload.dropoff_location || "-");
  const pickupDate = formatDate(String(payload.pickup_date || ""));
  const pickupTime = escapeHtml(payload.pickup_time || "-");
  const estimatedPrice = escapeHtml(payload.estimated_price_text || "-");
  const finalPrice = formatMoney(payload.final_price);
  const passengers = escapeHtml(payload.passengers || "-");
  const luggage = escapeHtml(payload.luggage || "-");
  const phone = escapeHtml(payload.phone || "-");
  const preferredContact = escapeHtml(payload.preferred_contact || "-");
  const notes = escapeHtml(payload.notes || "-");
  const priceNote = escapeHtml(payload.price_note || "-");

  return `
    <div style="font-family: Arial, sans-serif; background:#f6f8fb; padding:24px; color:#111827;">
      <div style="max-width:680px; margin:0 auto; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #e5e7eb;">
        <div style="background:#0f172a; color:#ffffff; padding:28px;">
          <div style="font-size:24px; font-weight:800;">Sacramento Shuttle</div>
          <div style="font-size:14px; opacity:0.9; margin-top:8px;">Airport transfers & private rides</div>
        </div>

        <div style="padding:30px 28px;">
          <div style="display:inline-block; background:#ecfdf5; color:#047857; padding:8px 12px; border-radius:999px; font-size:12px; font-weight:800; letter-spacing:0.04em;">
            BOOKING CONFIRMED
          </div>

          <h2 style="margin:18px 0 12px; font-size:28px; color:#111827;">Your ride is confirmed</h2>

          <p style="margin:0 0 16px; font-size:15px; line-height:1.7;">
            Hello <strong>${fullName}</strong>,
          </p>

          <p style="margin:0 0 16px; font-size:15px; line-height:1.7;">
            We are pleased to confirm your ride. Please keep your booking reference below in case you need to update or review your trip details.
          </p>

          <div style="margin:20px 0; background:#0f172a; color:#ffffff; border-radius:16px; padding:18px 20px;">
            <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.08em; opacity:0.75;">Booking code</div>
            <div style="margin-top:8px; font-size:24px; font-weight:800; letter-spacing:0.06em;">${bookingCode}</div>
          </div>

          <div style="background:#f8fafc; border:1px solid #e5e7eb; border-radius:16px; padding:20px; margin-top:18px;">
            <div style="font-size:17px; font-weight:800; margin-bottom:14px; color:#111827;">Confirmed trip details</div>
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr><td style="padding:8px 0; color:#6b7280; width:180px;">Service</td><td style="padding:8px 0; color:#111827;">${serviceType}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Pickup</td><td style="padding:8px 0; color:#111827;">${pickupLocation}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Dropoff</td><td style="padding:8px 0; color:#111827;">${dropoffLocation}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Date</td><td style="padding:8px 0; color:#111827;">${pickupDate}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Time</td><td style="padding:8px 0; color:#111827;">${pickupTime}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Passengers</td><td style="padding:8px 0; color:#111827;">${passengers}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Luggage</td><td style="padding:8px 0; color:#111827;">${luggage}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Estimated Fare</td><td style="padding:8px 0; color:#111827;">${estimatedPrice}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Final Price</td><td style="padding:8px 0; color:#111827;">${finalPrice}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280; vertical-align:top;">Price Note</td><td style="padding:8px 0; color:#111827;">${priceNote}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Preferred contact</td><td style="padding:8px 0; color:#111827;">${preferredContact}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Contact phone</td><td style="padding:8px 0; color:#111827;">${phone}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280; vertical-align:top;">Notes</td><td style="padding:8px 0; color:#111827;">${notes}</td></tr>
            </table>
          </div>

          <div style="margin-top:20px; background:#eff6ff; border:1px solid #bfdbfe; color:#1e3a8a; border-radius:14px; padding:14px 16px; font-size:14px; line-height:1.7;">
            If you need to make changes, please reply to this email or contact us as soon as possible.
          </div>

          <div style="margin-top:22px; padding-top:18px; border-top:1px solid #e5e7eb; font-size:14px; color:#6b7280; line-height:1.7;">
            <div><strong style="color:#111827;">Sacramento Shuttle</strong></div>
            <div>Private rides & airport transportation</div>
            <div>Reply to: ${escapeHtml(replyToEmail)}</div>
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
  const estimatedPrice = escapeHtml(payload.estimated_price_text || "-");
  const finalPrice = formatMoney(payload.final_price);
  const priceNote = escapeHtml(payload.price_note || "-");

  return `
    <div style="font-family: Arial, sans-serif; background:#f6f8fb; padding:24px; color:#111827;">
      <div style="max-width:680px; margin:0 auto; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #e5e7eb;">
        <div style="background:#111827; color:#ffffff; padding:26px 28px;">
          <div style="font-size:23px; font-weight:800;">Confirmation sent</div>
          <div style="font-size:14px; opacity:0.9; margin-top:8px;">Admin notification</div>
        </div>

        <div style="padding:28px;">
          <table style="width:100%; border-collapse:collapse; font-size:14px;">
            <tr><td style="padding:10px 0; color:#6b7280; width:180px;">Booking code</td><td style="padding:10px 0; color:#111827;"><strong>${bookingCode}</strong></td></tr>
            <tr><td style="padding:10px 0; color:#6b7280;">Customer</td><td style="padding:10px 0; color:#111827;">${fullName}</td></tr>
            <tr><td style="padding:10px 0; color:#6b7280;">Email</td><td style="padding:10px 0; color:#111827;">${email}</td></tr>
            <tr><td style="padding:10px 0; color:#6b7280;">Ride date</td><td style="padding:10px 0; color:#111827;">${pickupDate}</td></tr>
            <tr><td style="padding:10px 0; color:#6b7280;">Ride time</td><td style="padding:10px 0; color:#111827;">${pickupTime}</td></tr>
            <tr><td style="padding:10px 0; color:#6b7280;">Estimated Fare</td><td style="padding:10px 0; color:#111827;">${estimatedPrice}</td></tr>
            <tr><td style="padding:10px 0; color:#6b7280;">Final Price</td><td style="padding:10px 0; color:#111827;">${finalPrice}</td></tr>
            <tr><td style="padding:10px 0; color:#6b7280;">Price Note</td><td style="padding:10px 0; color:#111827;">${priceNote}</td></tr>
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
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY");
    }

    const payload = await req.json();
    const email = String(payload?.email ?? "").trim();

    if (!email) {
      return jsonResponse({ success: false, error: "Missing customer email" }, 400);
    }

    const subjectCode = String(payload?.booking_code ?? "").trim();
    const subject = subjectCode
      ? `Booking Confirmed - ${subjectCode}`
      : "Your ride has been confirmed - Sacramento Shuttle";

    const customerResult = await resend.emails.send({
      from: fromEmail,
      replyTo: replyToEmail,
      to: email,
      subject,
      html: buildCustomerHtml(payload),
    });

    if ((customerResult as { error?: unknown })?.error) {
      console.error("Resend customer send error =", (customerResult as { error?: unknown }).error);
      throw new Error("Failed to send customer confirmation email");
    }

    if (adminEmail) {
      const adminResult = await resend.emails.send({
        from: fromEmail,
        replyTo: replyToEmail,
        to: adminEmail,
        subject: `Confirmation Sent - ${String(payload?.booking_code ?? payload?.full_name ?? "Booking")}`,
        html: buildAdminHtml(payload),
      });

      if ((adminResult as { error?: unknown })?.error) {
        console.error("Resend admin send error =", (adminResult as { error?: unknown }).error);
      }
    }

    const resultId = (customerResult as { data?: { id?: string } })?.data?.id ?? null;
    return jsonResponse({ success: true, id: resultId }, 200);
  } catch (error) {
    console.error("send-confirmation error =", error);
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});
