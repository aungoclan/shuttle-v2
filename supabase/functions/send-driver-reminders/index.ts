import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";

const fromEmail =
  Deno.env.get("FROM_EMAIL")?.trim() ||
  "Sacramento Shuttle <booking@duadonsacramento.com>";

const driverEmail =
  Deno.env.get("DRIVER_EMAIL")?.trim() ||
  Deno.env.get("ADMIN_EMAIL")?.trim() ||
  "";

const replyToEmail =
  Deno.env.get("ADMIN_EMAIL")?.trim() ||
  driverEmail ||
  "booking@duadonsacramento.com";

const reminderSecret = Deno.env.get("DRIVER_REMINDER_SECRET")?.trim() || "";

const supabase = createClient(supabaseUrl, serviceRoleKey);
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-reminder-secret",
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

function getLaParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = part.value;
  }

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
  };
}

function dateKeyFromParts(parts: {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
}) {
  const yyyy = String(parts.year).padStart(4, "0");
  const mm = String(parts.month).padStart(2, "0");
  const dd = String(parts.day).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysToDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function wallClockMinutes(dateKey: string, timeValue: string) {
  const safeTime = String(timeValue || "").trim();
  const [year, month, day] = dateKey.split("-").map(Number);
  const [hourRaw, minuteRaw] = safeTime.split(":");

  const hour = Number(hourRaw);
  const minute = Number(minuteRaw || "0");

  if (
    !year ||
    !month ||
    !day ||
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return null;
  }

  return Math.floor(
    Date.UTC(year, month - 1, day, hour, minute, 0, 0) / 60000,
  );
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
  if (value === null || value === undefined || value === "") return "-";
  return `$${escapeHtml(value)}`;
}

function buildReminderHtml(
  booking: Record<string, unknown>,
  reminderLabel: string,
) {
  const bookingCode = escapeHtml(booking.booking_code || booking.id || "-");
  const fullName = escapeHtml(booking.full_name || "-");
  const phone = escapeHtml(booking.phone || "-");
  const email = escapeHtml(booking.email || "-");
  const serviceType = escapeHtml(booking.service_type || "-");
  const pickup = escapeHtml(booking.pickup_location || "-");
  const dropoff = escapeHtml(booking.dropoff_location || "-");
  const pickupDate = escapeHtml(formatDate(String(booking.pickup_date || "")));
  const pickupTime = escapeHtml(booking.pickup_time || "-");
  const passengers = escapeHtml(booking.passengers || "-");
  const luggage = escapeHtml(booking.luggage || "-");
  const notes = escapeHtml(booking.notes || "-");
  const internalNote = escapeHtml(booking.internal_note || "-");
  const estimatedPrice = escapeHtml(booking.estimated_price_text || "-");
  const finalPrice = formatMoney(booking.final_price);
  const priceNote = escapeHtml(booking.price_note || "-");

  return `
    <div style="font-family: Arial, sans-serif; background:#f6f8fb; padding:24px; color:#111827;">
      <div style="max-width:720px; margin:0 auto; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #e5e7eb;">
        <div style="background:#0f172a; color:#ffffff; padding:28px;">
          <div style="font-size:24px; font-weight:800;">Driver Reminder</div>
          <div style="font-size:14px; opacity:0.9; margin-top:8px;">${escapeHtml(reminderLabel)} upcoming ride</div>
        </div>

        <div style="padding:28px;">
          <div style="display:inline-block; background:#eff6ff; color:#1d4ed8; padding:8px 12px; border-radius:999px; font-size:12px; font-weight:800; letter-spacing:0.04em;">
            ${escapeHtml(reminderLabel)} REMINDER
          </div>

          <h2 style="margin:18px 0 12px; font-size:26px; color:#111827;">
            Upcoming confirmed ride
          </h2>

          <div style="margin:18px 0; background:#0f172a; color:#ffffff; border-radius:16px; padding:18px 20px;">
            <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.08em; opacity:0.75;">Booking code</div>
            <div style="margin-top:8px; font-size:24px; font-weight:800; letter-spacing:0.06em;">${bookingCode}</div>
          </div>

          <div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:16px; padding:18px; margin-bottom:18px;">
            <div style="font-size:16px; font-weight:800; color:#9a3412; margin-bottom:10px;">Pickup Time</div>
            <div style="font-size:22px; font-weight:800; color:#111827;">${pickupDate} at ${pickupTime}</div>
          </div>

          <div style="background:#f8fafc; border:1px solid #e5e7eb; border-radius:16px; padding:20px;">
            <div style="font-size:17px; font-weight:800; margin-bottom:14px;">Trip Details</div>
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr><td style="padding:8px 0; color:#6b7280; width:180px;">Customer</td><td style="padding:8px 0; color:#111827;">${fullName}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Phone</td><td style="padding:8px 0; color:#111827;">${phone}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Email</td><td style="padding:8px 0; color:#111827;">${email}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Service</td><td style="padding:8px 0; color:#111827;">${serviceType}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Pickup</td><td style="padding:8px 0; color:#111827;">${pickup}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Dropoff</td><td style="padding:8px 0; color:#111827;">${dropoff}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Passengers</td><td style="padding:8px 0; color:#111827;">${passengers}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Luggage</td><td style="padding:8px 0; color:#111827;">${luggage}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Estimated Fare</td><td style="padding:8px 0; color:#111827;">${estimatedPrice}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280;">Final Price</td><td style="padding:8px 0; color:#111827;">${finalPrice}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280; vertical-align:top;">Price Note</td><td style="padding:8px 0; color:#111827;">${priceNote}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280; vertical-align:top;">Customer Notes</td><td style="padding:8px 0; color:#111827;">${notes}</td></tr>
              <tr><td style="padding:8px 0; color:#6b7280; vertical-align:top;">Internal Note</td><td style="padding:8px 0; color:#111827;">${internalNote}</td></tr>
            </table>
          </div>

          <div style="margin-top:18px; background:#ecfdf5; border:1px solid #bbf7d0; color:#166534; border-radius:14px; padding:14px 16px; font-size:14px; line-height:1.7;">
            Reminder sent automatically for a confirmed booking. Please review pickup location, time, customer phone, luggage, and notes before the ride.
          </div>
        </div>
      </div>
    </div>
  `;
}

async function sendReminderEmail(
  booking: Record<string, unknown>,
  reminderType: "24h" | "2h",
) {
  const bookingCode = String(booking.booking_code || booking.id || "Booking");
  const fullName = String(booking.full_name || "Customer");
  const pickupDate = String(booking.pickup_date || "");
  const pickupTime = String(booking.pickup_time || "");
  const label = reminderType === "24h" ? "24-hour" : "2-hour";

  const result = await resend.emails.send({
    from: fromEmail,
    replyTo: replyToEmail,
    to: driverEmail,
    subject: `${label} Driver Reminder - ${bookingCode} - ${fullName} - ${pickupDate} ${pickupTime}`,
    html: buildReminderHtml(booking, label),
  });

  if ((result as { error?: unknown })?.error) {
    console.error("Resend driver reminder error =", (result as { error?: unknown }).error);
    throw new Error("Failed to send driver reminder email");
  }

  return (result as { data?: { id?: string } })?.data?.id ?? null;
}

async function processWindow(reminderType: "24h" | "2h") {
  const nowParts = getLaParts();
  const todayKey = dateKeyFromParts(nowParts);
  const tomorrowKey = addDaysToDateKey(todayKey, 1);
  const afterTomorrowKey = addDaysToDateKey(todayKey, 2);

  const nowMinutes = wallClockMinutes(
    todayKey,
    `${String(nowParts.hour).padStart(2, "0")}:${String(nowParts.minute).padStart(2, "0")}`,
  );

  if (nowMinutes === null) {
    throw new Error("Could not calculate Los Angeles current time.");
  }

  const targetMinutes = nowMinutes + (reminderType === "24h" ? 24 * 60 : 2 * 60);
  const toleranceMinutes = reminderType === "24h" ? 45 : 20;
  const minTarget = targetMinutes - toleranceMinutes;
  const maxTarget = targetMinutes + toleranceMinutes;

  const sentColumn =
    reminderType === "24h"
      ? "driver_reminder_24h_sent_at"
      : "driver_reminder_2h_sent_at";

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("status", "confirmed")
    .gte("pickup_date", todayKey)
    .lte("pickup_date", afterTomorrowKey)
    .is(sentColumn, null)
    .order("pickup_date", { ascending: true })
    .order("pickup_time", { ascending: true });

  if (error) {
    console.error("Fetch reminder bookings error =", error);
    throw new Error("Could not fetch reminder bookings.");
  }

  const candidates = data || [];
  const matched = candidates.filter((booking) => {
    const pickupDate = String(booking.pickup_date || "");
    const pickupTime = String(booking.pickup_time || "");
    const bookingMinutes = wallClockMinutes(pickupDate, pickupTime);

    if (bookingMinutes === null) return false;

    return bookingMinutes >= minTarget && bookingMinutes <= maxTarget;
  });

  const results = [];

  for (const booking of matched) {
    try {
      const emailId = await sendReminderEmail(booking, reminderType);
      const sentAt = new Date().toISOString();

      const { error: updateError } = await supabase
        .from("bookings")
        .update({ [sentColumn]: sentAt })
        .eq("id", booking.id);

      if (updateError) {
        console.error("Reminder sent but DB update failed =", updateError);
        results.push({
          id: booking.id,
          booking_code: booking.booking_code,
          reminderType,
          sent: true,
          emailId,
          updated: false,
          error: updateError.message,
        });
        continue;
      }

      results.push({
        id: booking.id,
        booking_code: booking.booking_code,
        reminderType,
        sent: true,
        emailId,
        updated: true,
      });
    } catch (error) {
      console.error("Send reminder failed =", error);
      results.push({
        id: booking.id,
        booking_code: booking.booking_code,
        reminderType,
        sent: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    reminderType,
    scanned: candidates.length,
    matched: matched.length,
    sent: results.filter((item) => item.sent).length,
    results,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    if (!supabaseUrl) throw new Error("Missing SUPABASE_URL");
    if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
    if (!resendApiKey) throw new Error("Missing RESEND_API_KEY");
    if (!driverEmail) throw new Error("Missing DRIVER_EMAIL or ADMIN_EMAIL");

    if (reminderSecret) {
      const incomingSecret = req.headers.get("x-reminder-secret")?.trim() || "";
      if (incomingSecret !== reminderSecret) {
        return jsonResponse({ success: false, error: "Unauthorized" }, 401);
      }
    }

    const body = await req.json().catch(() => ({}));
    const mode = String(body?.mode || "both");

    const allResults = [];

    if (mode === "both" || mode === "24h") {
      allResults.push(await processWindow("24h"));
    }

    if (mode === "both" || mode === "2h") {
      allResults.push(await processWindow("2h"));
    }

    return jsonResponse({
      success: true,
      checkedAt: new Date().toISOString(),
      mode,
      results: allResults,
    });
  } catch (error) {
    console.error("send-driver-reminders error =", error);
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});