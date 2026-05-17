import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Resend sandbox sender — replace with a verified domain address in production
const FROM_ADDRESS = "Ghana MFA Attestation Portal <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { applicationId, status, rejectionReason } = await req.json();

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: application, error: appError } = await adminClient
      .from("applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      throw new Error(`Application not found: ${appError?.message}`);
    }

    const { data: { user }, error: userError } =
      await adminClient.auth.admin.getUserById(application.user_id);

    if (userError || !user?.email) {
      throw new Error(`User not found: ${userError?.message}`);
    }

    const applicantName = application.personal_details?.fullName || "Applicant";
    const appointment = application.appointment_details || {};

    const subject =
      status === "Approved"
        ? `Your Application ${applicationId} Has Been Approved — Ghana MFA`
        : `Action Required: Update on Application ${applicationId} — Ghana MFA`;

    const html =
      status === "Approved"
        ? buildApprovedEmail(applicantName, applicationId, application.document_type, appointment)
        : buildRejectedEmail(applicantName, applicationId, application.document_type, rejectionReason);

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({ from: FROM_ADDRESS, to: [user.email], subject, html }),
    });

    const result = await resendRes.json();

    if (!resendRes.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(result)}`);
    }

    return new Response(JSON.stringify({ success: true, emailId: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-status-email error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function flagBar(height = 6) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="33%" height="${height}" bgcolor="#CE1126"></td>
        <td width="34%" height="${height}" bgcolor="#FCD116"></td>
        <td width="33%" height="${height}" bgcolor="#006B3F"></td>
      </tr>
    </table>`;
}

function emailShell(badge: string, badgeBg: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f0efee;font-family:Arial,Helvetica,sans-serif;">
  ${flagBar(6)}
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:32px 16px 48px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td bgcolor="#081524" style="padding:32px 40px;">
              <p style="margin:0 0 4px 0;color:#fcd116;font-size:9px;font-weight:800;
                letter-spacing:3px;text-transform:uppercase;">REPUBLIC OF GHANA</p>
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:800;
                line-height:1.2;">Ministry of Foreign Affairs</p>
              <p style="margin:4px 0 0 0;color:rgba(255,255,255,0.45);font-size:11px;">
                Document Attestation Portal</p>
            </td>
          </tr>
          <!-- Status badge row -->
          <tr>
            <td bgcolor="${badgeBg}" style="padding:20px 40px;border-bottom:1px solid rgba(0,0,0,0.06);">
              <span style="display:inline-block;background:#ffffff;color:${badge === 'APPROVED' ? '#16a34a' : '#dc2626'};
                font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;
                padding:6px 18px;border-radius:40px;border:1.5px solid ${badge === 'APPROVED' ? '#bbf7d0' : '#fecaca'};">
                ${badge}
              </span>
            </td>
          </tr>
          <!-- Body -->
          ${body}
          <!-- Footer -->
          <tr>
            <td bgcolor="#081524" style="padding:24px 40px;">
              <p style="margin:0 0 6px 0;color:rgba(255,255,255,0.5);font-size:11px;">
                Ministry of Foreign Affairs &bull; Republic of Ghana
              </p>
              <p style="margin:0;color:rgba(255,255,255,0.3);font-size:10px;">
                This is an automated notification. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  ${flagBar(4)}
</body>
</html>`;
}

function detailsTable(rows: Array<[string, string, string?]>) {
  const rowsHtml = rows.map(([label, value, color]) => `
    <tr>
      <td style="padding:6px 0;font-size:12px;color:#888;">${label}</td>
      <td style="padding:6px 0;font-size:12px;font-weight:700;color:${color || "#081524"};text-align:right;">${value}</td>
    </tr>`).join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background:#f9f8f7;border-radius:12px;border:1px solid #e8e6e4;">
      <tr><td style="padding:20px 20px 4px;">
        <p style="margin:0 0 12px 0;font-size:9px;font-weight:800;color:#aaa;
          text-transform:uppercase;letter-spacing:2px;">Application Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${rowsHtml}
        </table>
      </td></tr>
      <tr><td style="padding:0 20px 20px;"></td></tr>
    </table>`;
}

function buildApprovedEmail(
  name: string,
  applicationId: string,
  documentType: string,
  appointment: Record<string, string>,
) {
  const body = `
    <tr>
      <td style="padding:36px 40px 32px;">
        <p style="margin:0 0 6px 0;font-size:16px;font-weight:700;color:#081524;">
          Dear ${name},
        </p>
        <p style="margin:0 0 24px 0;font-size:14px;line-height:22px;color:#555;">
          We are pleased to inform you that your document attestation application has been
          <strong style="color:#16a34a;">approved</strong> by the Ministry of Foreign Affairs.
          Please review the details below and attend your scheduled appointment.
        </p>

        ${detailsTable([
          ["Application ID", applicationId],
          ["Document Type", documentType],
          ["Appointment Date", appointment.date || "As scheduled"],
          ["Appointment Time", appointment.time || "As scheduled"],
          ["Status", "Approved", "#16a34a"],
        ])}

        <p style="margin:24px 0 10px 0;font-size:13px;font-weight:700;color:#081524;">
          What to bring to your appointment
        </p>
        <table cellpadding="0" cellspacing="0" border="0">
          ${["Original documents submitted for attestation",
             "Valid Ghana Card or passport",
             `Your application reference: <strong>${applicationId}</strong>`]
            .map(item => `
              <tr>
                <td valign="top" style="padding:4px 8px 4px 0;color:#fcd116;font-size:14px;">&#10003;</td>
                <td style="padding:4px 0;font-size:13px;color:#555;line-height:20px;">${item}</td>
              </tr>`).join("")}
        </table>

        <p style="margin:28px 0 0 0;font-size:12px;color:#aaa;line-height:18px;">
          If you have any questions, please contact the Ministry of Foreign Affairs
          attestation desk and quote your application ID.
        </p>
      </td>
    </tr>`;

  return emailShell("APPLICATION APPROVED", "#f0fdf4", body);
}

function buildRejectedEmail(
  name: string,
  applicationId: string,
  documentType: string,
  rejectionReason: string,
) {
  const body = `
    <tr>
      <td style="padding:36px 40px 32px;">
        <p style="margin:0 0 6px 0;font-size:16px;font-weight:700;color:#081524;">
          Dear ${name},
        </p>
        <p style="margin:0 0 24px 0;font-size:14px;line-height:22px;color:#555;">
          Thank you for submitting your application. After careful review, we regret to inform you
          that your attestation application could <strong style="color:#dc2626;">not be approved</strong>
          at this time. Please see the reason below and the steps to resubmit.
        </p>

        <!-- Rejection reason box -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="background:#fff5f5;border-radius:12px;border:1px solid #fecaca;margin-bottom:24px;">
          <tr>
            <td style="padding:20px;">
              <p style="margin:0 0 8px 0;font-size:9px;font-weight:800;color:#dc2626;
                text-transform:uppercase;letter-spacing:2px;">Reason for Rejection</p>
              <p style="margin:0;font-size:13px;line-height:21px;color:#7f1d1d;">
                ${rejectionReason || "Please contact the attestation office for details."}
              </p>
            </td>
          </tr>
        </table>

        ${detailsTable([
          ["Application ID", applicationId],
          ["Document Type", documentType],
          ["Status", "Rejected", "#dc2626"],
        ])}

        <p style="margin:24px 0 10px 0;font-size:13px;font-weight:700;color:#081524;">
          Next steps
        </p>
        <table cellpadding="0" cellspacing="0" border="0">
          ${["Address the issue stated above and gather the correct documents.",
             "Log in to the Attestation Portal and submit a new application.",
             "Contact the attestation desk if you need clarification before resubmitting."]
            .map((item, i) => `
              <tr>
                <td valign="top" style="padding:4px 10px 4px 0;color:#fcd116;font-size:13px;font-weight:800;">${i + 1}.</td>
                <td style="padding:4px 0;font-size:13px;color:#555;line-height:20px;">${item}</td>
              </tr>`).join("")}
        </table>

        <p style="margin:28px 0 0 0;font-size:12px;color:#aaa;line-height:18px;">
          If you believe this decision was made in error, please contact the Ministry of Foreign
          Affairs attestation desk and quote your application ID <strong>${applicationId}</strong>.
        </p>
      </td>
    </tr>`;

  return emailShell("APPLICATION NOT APPROVED", "#fff5f5", body);
}
