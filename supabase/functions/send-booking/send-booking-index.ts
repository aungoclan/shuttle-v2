import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const allowedOrigins = new Set([
  "https://duadonsacramento.com",
  "https://www.duadonsacramento.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...(Deno.env.get("ALLOWED_ORIGINS") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
]);

function getCorsHeaders(origin: string | null) {
  const allowOrigin = origin && allowedOrigins.has(origin)
    ? origin
    : "https://www.duadonsacramento.com";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function requiredString(value: unknown) {
  return String(value ?? "").trim();
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

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
    const payload = await req.json();

    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    const fromEmail = Deno.env.get("FROM_EMAIL") || "booking@duadonsacramento.com";

    const fullName = requiredString(payload.full_name);
    const phone = requiredString(payload.phone);
    const pickupLocation = requiredString(payload.pickup_location);
    const dropoffLocation = requiredString(payload.dropoff_location);
    const pickupDate = requiredString(payload.pickup_date);
    const pickupTime = requiredString(payload.pickup_time);

    if (!fullName || !phone || !pickupLocation || !dropoffLocation || !pickupDate || !pickupTime) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required booking fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const customerEmail = requiredString(payload.email);
    const safe = {
      fullName: escapeHtml(fullName),
      phone: escapeHtml(phone),
      email: escapeHtml(customerEmail || "-"),
      serviceType: escapeHtml(requiredString(payload.service_type) || "-"),
      pickupLocation: escapeHtml(pickupLocation),
      dropoffLocation: escapeHtml(dropoffLocation),
      pickupDate: escapeHtml(pickupDate),
      pickupTime: escapeHtml(pickupTime),
      passengers: escapeHtml(requiredString(payload.passengers) || "-"),
      luggage: escapeHtml(requiredString(payload.luggage) || "-"),
      preferredContact: escapeHtml(requiredString(payload.preferred_contact) || "-"),
      notes: escapeHtml(requiredString(payload.notes) || "-"),
    };

    const sendJobs = [];

    if (customerEmail) {
      sendJobs.push(
        resend.emails.send({
          from: fromEmail,
          to: customerEmail,
          subject: "We received your ride request",
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.7;color:#0f172a;padding:24px;background:#f8fafc;">
              <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;padding:24px;">
                <h2 style="margin-top:0;">Your booking request has been received</h2>
                <p>Hello ${safe.fullName},</p>
                <p>We received your trip request and will contact you shortly to confirm the details.</p>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;">
                  <p><strong>Service:</strong> ${safe.serviceType}</p>
                  <p><strong>Pickup:</strong> ${safe.pickupLocation}</p>
                  <p><strong>Dropoff:</strong> ${safe.dropoffLocation}</p>
                  <p><strong>Date:</strong> ${safe.pickupDate}</p>
                  <p><strong>Time:</strong> ${safe.pickupTime}</p>
                </div>
                <p style="margin-bottom:0;">If your ride is urgent, please call us directly.</p>
              </div>
            </div>
          `,
        })
      );
    }

    if (adminEmail) {
      sendJobs.push(
        resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: `New booking received: ${fullName}`,
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.7;color:#0f172a;padding:24px;background:#f8fafc;">
              <div style="max-width:700px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;padding:24px;">
                <h2 style="margin-top:0;">New Booking Received</h2>
                <p><strong>Name:</strong> ${safe.fullName}</p>
                <p><strong>Phone:</strong> ${safe.phone}</p>
                <p><strong>Email:</strong> ${safe.email}</p>
                <p><strong>Service:</strong> ${safe.serviceType}</p>
                <p><strong>Pickup:</strong> ${safe.pickupLocation}</p>
                <p><strong>Dropoff:</strong> ${safe.dropoffLocation}</p>
                <p><strong>Date:</strong> ${safe.pickupDate}</p>
                <p><strong>Time:</strong> ${safe.pickupTime}</p>
                <p><strong>Passengers:</strong> ${safe.passengers}</p>
                <p><strong>Luggage:</strong> ${safe.luggage}</p>
                <p><strong>Preferred contact:</strong> ${safe.preferredContact}</p>
                <p><strong>Notes:</strong> ${safe.notes}</p>
              </div>
            </div>
          `,
        })
      );
    }

    await Promise.all(sendJobs);

    return new Response(
      JSON.stringify({ success: true, message: "Booking email processed" }),
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
