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

    console.log("payload.email =", payload?.email);
    console.log("adminEmail =", adminEmail);

    if (payload?.email) {
      const customerResult = await resend.emails.send({
        from: "Sacramento Shuttle <booking@duadonsacramento.com>",
        replyTo: "aungoclan@gmail.com",
        to: payload.email,
        subject: "Booking Request Received - Sacramento Shuttle",
        html: `
          <div style="font-family: Arial, sans-serif; background:#f6f8fb; padding:24px; color:#111827;">
            <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e5e7eb;">
              
              <div style="background:#0f172a; color:#ffffff; padding:24px 28px;">
                <div style="font-size:22px; font-weight:700;">Sacramento Shuttle</div>
                <div style="font-size:14px; opacity:0.9; margin-top:6px;">Airport transfer & private rides</div>
              </div>

              <div style="padding:28px;">
                <h2 style="margin:0 0 12px; font-size:24px; color:#111827;">Booking request received</h2>

                <p style="margin:0 0 16px; font-size:15px; line-height:1.6;">
                  Hello <strong>${payload.full_name ?? ""}</strong>,
                </p>

                <p style="margin:0 0 16px; font-size:15px; line-height:1.6;">
                  Thank you for your booking request. We have received your trip details and will contact you shortly to confirm availability, pricing, and final scheduling.
                </p>

                <div style="background:#f8fafc; border:1px solid #e5e7eb; border-radius:12px; padding:18px 20px; margin:20px 0;">
                  <div style="font-size:16px; font-weight:700; margin-bottom:12px; color:#111827;">Trip details</div>

                  <table style="width:100%; border-collapse:collapse; font-size:14px;">
                    <tr>
                      <td style="padding:8px 0; color:#6b7280; width:160px;">Full name</td>
                      <td style="padding:8px 0; color:#111827;">${payload.full_name ?? "-"}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#6b7280;">Phone</td>
                      <td style="padding:8px 0; color:#111827;">${payload.phone ?? "-"}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#6b7280;">Pickup</td>
                      <td style="padding:8px 0; color:#111827;">${payload.pickup_location ?? "-"}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#6b7280;">Dropoff</td>
                      <td style="padding:8px 0; color:#111827;">${payload.dropoff_location ?? "-"}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#6b7280;">Date</td>
                      <td style="padding:8px 0; color:#111827;">${payload.pickup_date ?? "-"}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#6b7280;">Time</td>
                      <td style="padding:8px 0; color:#111827;">${payload.pickup_time ?? "-"}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#6b7280;">Passengers</td>
                      <td style="padding:8px 0; color:#111827;">${payload.passengers ?? "-"}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#6b7280;">Luggage</td>
                      <td style="padding:8px 0; color:#111827;">${payload.luggage ?? "-"}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#6b7280;">Preferred contact</td>
                      <td style="padding:8px 0; color:#111827;">${payload.preferred_contact ?? "-"}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0; color:#6b7280;">Notes</td>
                      <td style="padding:8px 0; color:#111827;">${payload.notes ?? "-"}</td>
                    </tr>
                  </table>
                </div>

                <p style="margin:0 0 14px; font-size:15px; line-height:1.6;">
                  If you need to update your request, please reply to this email or contact us directly.
                </p>

                <div style="margin-top:20px; padding-top:18px; border-top:1px solid #e5e7eb; font-size:14px; color:#6b7280;">
                  <div><strong style="color:#111827;">Sacramento Shuttle</strong></div>
                  <div>Private rides & airport transportation</div>
                  <div style="margin-top:8px;">Reply to: aungoclan@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        `,
      });

      console.log("customer email result =", customerResult);
    }

    if (adminEmail) {
      const adminResult = await resend.emails.send({
        from: "Sacramento Shuttle <booking@duadonsacramento.com>",
        replyTo: "aungoclan@gmail.com",
        to: adminEmail,
        subject: `New Booking - ${payload.full_name ?? "Unknown"} - ${payload.pickup_date ?? ""} ${payload.pickup_time ?? ""}`,
        html: `
          <div style="font-family: Arial, sans-serif; background:#f6f8fb; padding:24px; color:#111827;">
            <div style="max-width:720px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e5e7eb;">

              <div style="background:#111827; color:#ffffff; padding:24px 28px;">
                <div style="font-size:22px; font-weight:700;">New Booking Received</div>
                <div style="font-size:14px; opacity:0.9; margin-top:6px;">Admin notification</div>
              </div>

              <div style="padding:28px;">
                <div style="display:inline-block; background:#fef3c7; color:#92400e; padding:6px 10px; border-radius:999px; font-size:12px; font-weight:700; margin-bottom:16px;">
                  STATUS: NEW
                </div>

                <table style="width:100%; border-collapse:collapse; font-size:14px;">
                  <tr>
                    <td style="padding:10px 0; color:#6b7280; width:180px;">Customer name</td>
                    <td style="padding:10px 0; color:#111827;"><strong>${payload.full_name ?? "-"}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; color:#6b7280;">Phone</td>
                    <td style="padding:10px 0; color:#111827;">${payload.phone ?? "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; color:#6b7280;">Email</td>
                    <td style="padding:10px 0; color:#111827;">${payload.email ?? "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; color:#6b7280;">Service type</td>
                    <td style="padding:10px 0; color:#111827;">${payload.service_type ?? "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; color:#6b7280;">Pickup location</td>
                    <td style="padding:10px 0; color:#111827;">${payload.pickup_location ?? "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; color:#6b7280;">Dropoff location</td>
                    <td style="padding:10px 0; color:#111827;">${payload.dropoff_location ?? "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; color:#6b7280;">Pickup date</td>
                    <td style="padding:10px 0; color:#111827;">${payload.pickup_date ?? "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; color:#6b7280;">Pickup time</td>
                    <td style="padding:10px 0; color:#111827;">${payload.pickup_time ?? "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; color:#6b7280;">Passengers</td>
                    <td style="padding:10px 0; color:#111827;">${payload.passengers ?? "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; color:#6b7280;">Luggage</td>
                    <td style="padding:10px 0; color:#111827;">${payload.luggage ?? "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; color:#6b7280;">Preferred contact</td>
                    <td style="padding:10px 0; color:#111827;">${payload.preferred_contact ?? "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0; color:#6b7280;">Notes</td>
                    <td style="padding:10px 0; color:#111827;">${payload.notes ?? "-"}</td>
                  </tr>
                </table>

                <div style="margin-top:24px; background:#eff6ff; border:1px solid #bfdbfe; color:#1e3a8a; padding:14px 16px; border-radius:12px; font-size:14px;">
                  Please review this booking in the admin dashboard and contact the customer to confirm the ride.
                </div>
              </div>
            </div>
          </div>
        `,
      });

      console.log("admin email result =", adminResult);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Booking email sent successfully",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("send-booking error =", error);

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