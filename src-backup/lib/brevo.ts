// Brevo (SendinBlue) email utility
// Sends transactional emails: welcome, admin alerts, support

const BREVO_KEY = process.env.BREVO_KEY || "";
const ADMIN_EMAIL = "samzretailltd@gmail.com";
const FROM_EMAIL = "hello@unicornds.io";
const FROM_NAME = "UnicornDS";

async function sendBrevoEmail({
  to,
  toName,
  subject,
  html,
}: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}) {
  try {
    if (!BREVO_KEY) { console.warn("[Brevo] No API key set — skipping email"); return false; }
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: to, name: toName || to }],
        subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      console.error("[Brevo] Email failed:", res.status, await res.text());
      return false;
    }
    console.log("[Brevo] Email sent:", subject, "→", to);
    return true;
  } catch (e) {
    console.error("[Brevo] Email error:", e);
    return false;
  }
}

// ═══════════════════════════════════════════════
// EMAIL TEMPLATES
// ═══════════════════════════════════════════════

const brandHeader = `
<div style="background:#1E1B4B;padding:24px 32px;text-align:center;border-radius:12px 12px 0 0;">
  <h1 style="margin:0;color:#F59E0B;font-size:24px;font-weight:800;letter-spacing:-0.5px;">⚡ UnicornDS</h1>
</div>`;

const brandFooter = `
<div style="background:#f8f9fa;padding:20px 32px;text-align:center;border-radius:0 0 12px 12px;border-top:1px solid #eee;">
  <p style="margin:0;color:#666;font-size:12px;">UnicornDS — eBay Automation Tool</p>
  <p style="margin:4px 0 0;color:#999;font-size:11px;">
    <a href="https://www.unicornds.io" style="color:#7C3AED;">unicornds.io</a> · 
    <a href="mailto:support@unicornds.io" style="color:#7C3AED;">support@unicornds.io</a>
  </p>
</div>`;

function wrapTemplate(content: string) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:20px;background:#f0f0f5;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  ${brandHeader}
  <div style="padding:32px;">
    ${content}
  </div>
  ${brandFooter}
</div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════
// 1. WELCOME EMAIL — sent to customer after signup + card capture
// ═══════════════════════════════════════════════
export async function sendWelcomeEmail(email: string, name: string, tier: string, trialDays: number = 14) {
  const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
  const html = wrapTemplate(`
    <h2 style="color:#1E1B4B;margin:0 0 16px;">Welcome to UnicornDS, ${name || "there"}! 🎉</h2>
    <p style="color:#333;font-size:15px;line-height:1.6;">
      Your <strong>${tierName}</strong> plan is now active with a <strong>${trialDays}-day free trial</strong>.
      Your card will not be charged until the trial ends.
    </p>
    
    <div style="background:#f8f5ff;border:1px solid #e8e0ff;border-radius:8px;padding:16px;margin:20px 0;">
      <h3 style="color:#7C3AED;margin:0 0 12px;font-size:14px;">🚀 Get Started in 3 Steps:</h3>
      <p style="color:#333;font-size:14px;margin:4px 0;"><strong>1.</strong> <a href="https://www.unicornds.io/download" style="color:#7C3AED;">Download the Chrome extension</a></p>
      <p style="color:#333;font-size:14px;margin:4px 0;"><strong>2.</strong> Open Product Hunter and search for winning products</p>
      <p style="color:#333;font-size:14px;margin:4px 0;"><strong>3.</strong> Transfer to Bulk Lister and watch them list automatically</p>
    </div>

    <p style="color:#333;font-size:14px;line-height:1.6;">
      Need help? Reply to this email or visit our <a href="https://www.unicornds.io/support" style="color:#7C3AED;">support page</a>.
    </p>

    <div style="text-align:center;margin:24px 0 8px;">
      <a href="https://www.unicornds.io/download" style="background:#7C3AED;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">Download Extension</a>
    </div>

    <div style="background:#FFF7ED;border:1px solid #F59E0B;border-radius:8px;padding:16px;margin:20px 0;text-align:center;">
      <h3 style="color:#92400E;margin:0 0 8px;font-size:15px;">🎯 Book Your Free 1-on-1 Onboarding Call</h3>
      <p style="color:#78350F;font-size:13px;margin:0 0 12px;">Get a personal walkthrough with our founder. We will set up everything together — your settings, first listings, and answer all your questions.</p>
      <a href="https://calendly.com/1stunicornltd/30min" style="background:#F59E0B;color:#fff;padding:10px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px;">Book 30-Min Call (Free)</a>
    </div>
  `);

  return sendBrevoEmail({ to: email, toName: name, subject: `Welcome to UnicornDS — Your ${tierName} trial is active!`, html });
}

// ═══════════════════════════════════════════════
// 2. ADMIN ALERT — New signup
// ═══════════════════════════════════════════════
export async function sendAdminNewSignup(userData: {
  email: string;
  fullName: string;
  phone: string;
  country: string;
  ip?: string;
}) {
  const html = wrapTemplate(`
    <h2 style="color:#10B981;margin:0 0 16px;">🆕 New User Signed Up!</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#666;width:100px;">Name:</td><td style="padding:8px 0;color:#333;font-weight:bold;">${userData.fullName || "—"}</td></tr>
      <tr><td style="padding:8px 0;color:#666;">Email:</td><td style="padding:8px 0;color:#333;font-weight:bold;">${userData.email}</td></tr>
      <tr><td style="padding:8px 0;color:#666;">Phone:</td><td style="padding:8px 0;color:#333;">${userData.phone || "—"}</td></tr>
      <tr><td style="padding:8px 0;color:#666;">Country:</td><td style="padding:8px 0;color:#333;">${userData.country || "—"}</td></tr>
      <tr><td style="padding:8px 0;color:#666;">IP:</td><td style="padding:8px 0;color:#333;font-size:12px;">${userData.ip || "—"}</td></tr>
    </table>
    <div style="margin-top:16px;text-align:center;">
      <a href="https://www.unicornds.io/admin" style="background:#1E1B4B;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:13px;">View Admin Panel</a>
    </div>
  `);

  return sendBrevoEmail({ to: ADMIN_EMAIL, subject: `🆕 New signup: ${userData.fullName || userData.email}`, html });
}

// ═══════════════════════════════════════════════
// 3. ADMIN ALERT — New subscription/payment
// ═══════════════════════════════════════════════
export async function sendAdminNewPayment(data: {
  email: string;
  tier: string;
  amount: number;
  currency: string;
  period: string;
  isTrial: boolean;
}) {
  const tierName = data.tier.charAt(0).toUpperCase() + data.tier.slice(1);
  const html = wrapTemplate(`
    <h2 style="color:#F59E0B;margin:0 0 16px;">${data.isTrial ? "🎯 New Trial Started!" : "💰 New Payment!"}</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#666;width:100px;">Email:</td><td style="padding:8px 0;color:#333;font-weight:bold;">${data.email}</td></tr>
      <tr><td style="padding:8px 0;color:#666;">Plan:</td><td style="padding:8px 0;color:#333;font-weight:bold;">${tierName}</td></tr>
      <tr><td style="padding:8px 0;color:#666;">Amount:</td><td style="padding:8px 0;color:#333;">${data.isTrial ? "£0 (14-day trial)" : "£" + data.amount.toFixed(2)}</td></tr>
      <tr><td style="padding:8px 0;color:#666;">Period:</td><td style="padding:8px 0;color:#333;">${data.period}</td></tr>
    </table>
    <div style="margin-top:16px;text-align:center;">
      <a href="https://www.unicornds.io/admin" style="background:#1E1B4B;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:13px;">View Admin Panel</a>
    </div>
  `);

  return sendBrevoEmail({ to: ADMIN_EMAIL, subject: `${data.isTrial ? "🎯 Trial" : "💰 Payment"}: ${data.email} → ${tierName} (${data.period})`, html });
}

// ═══════════════════════════════════════════════
// 4. ADMIN ALERT — Subscription cancelled
// ═══════════════════════════════════════════════
export async function sendAdminCancellation(email: string, tier: string) {
  const html = wrapTemplate(`
    <h2 style="color:#EF4444;margin:0 0 16px;">❌ Subscription Cancelled</h2>
    <p style="color:#333;font-size:14px;"><strong>${email}</strong> cancelled their <strong>${tier}</strong> plan.</p>
    <div style="margin-top:16px;text-align:center;">
      <a href="https://www.unicornds.io/admin" style="background:#1E1B4B;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:13px;">View Admin Panel</a>
    </div>
  `);

  return sendBrevoEmail({ to: ADMIN_EMAIL, subject: `❌ Cancelled: ${email} (${tier})`, html });
}

// ═══════════════════════════════════════════════
// 5. ADMIN ALERT — Payment failed
// ═══════════════════════════════════════════════
export async function sendAdminPaymentFailed(email: string, tier: string) {
  const html = wrapTemplate(`
    <h2 style="color:#F59E0B;margin:0 0 16px;">⚠️ Payment Failed</h2>
    <p style="color:#333;font-size:14px;"><strong>${email}</strong> — payment failed for <strong>${tier}</strong> plan. Stripe will retry automatically.</p>
    <div style="margin-top:16px;text-align:center;">
      <a href="https://www.unicornds.io/admin" style="background:#1E1B4B;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:13px;">View Admin Panel</a>
    </div>
  `);

  return sendBrevoEmail({ to: ADMIN_EMAIL, subject: `⚠️ Payment failed: ${email} (${tier})`, html });
}

// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
// TELEGRAM INSTANT ALERTS
// ═══════════════════════════════════════════════
const TG_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

export async function sendTelegram(message: string) {
  try {
    if (!TG_BOT_TOKEN || !TG_CHAT_ID) { console.warn("[Telegram] No token/chat_id — skipping"); return; }
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text: message, parse_mode: "HTML" }),
    });
  } catch (e) {
    console.error("[Telegram] Failed:", e);
  }
}

// 6. ONBOARDING INVITE — sent to existing users
// ═══════════════════════════════════════════════
export async function sendOnboardingInvite(email: string, name: string) {
  const firstName = name ? name.split(' ')[0] : 'there';
  const html = wrapTemplate(`
    <h2 style="color:#1E1B4B;margin:0 0 16px;">Hey ${firstName}! 👋</h2>
    
    <p style="color:#333;font-size:15px;line-height:1.6;">
      Thank you for joining UnicornDS! I am Zohaib, the founder, and I want to make sure you get the most out of the tool.
    </p>

    <div style="background:#FFF7ED;border:2px solid #F59E0B;border-radius:12px;padding:24px;margin:20px 0;text-align:center;">
      <h3 style="color:#92400E;margin:0 0 8px;font-size:18px;">🎯 Book Your Free 1-on-1 Onboarding Call</h3>
      <p style="color:#78350F;font-size:14px;margin:0 0 16px;line-height:1.5;">
        I will personally walk you through everything:<br/>
        ✅ Setting up your extension and pricing rules<br/>
        ✅ Finding your first winning products<br/>
        ✅ Creating your first eBay listings<br/>
        ✅ Answering all your questions
      </p>
      <a href="https://calendly.com/1stunicornltd/30min" style="background:#F59E0B;color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">Book Your Free 30-Min Call</a>
      <p style="color:#92400E;font-size:12px;margin:10px 0 0;">30 minutes · Google Meet · Weekdays 9am-5pm UK time</p>
    </div>

    <p style="color:#333;font-size:14px;line-height:1.6;">
      This is completely free and there is no pressure — I just want to help you get started right and make your first sales faster.
    </p>

    <p style="color:#333;font-size:14px;line-height:1.6;">
      If you prefer to learn on your own, we also have video tutorials on your <a href="https://www.unicornds.io/dashboard" style="color:#7C3AED;">dashboard</a>.
    </p>

    <p style="color:#333;font-size:14px;line-height:1.6;">
      Looking forward to speaking with you!<br/>
      <strong>Zohaib Hassan</strong><br/>
      <span style="color:#666;font-size:13px;">Founder, UnicornDS</span>
    </p>
  `);

  return sendBrevoEmail({ to: email, toName: name, subject: `🎯 ${firstName}, let's set up your UnicornDS together — book your free call`, html });
}
