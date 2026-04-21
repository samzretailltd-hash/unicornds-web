import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy — UnicornDS", description: "How UnicornDS collects, uses, and protects your personal data." };
export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold mb-2 text-white">Privacy Policy</h1>
      <p className="text-sm text-[#6b6899] mb-10">Last updated: 13 April 2026</p>
      <div className="space-y-5 text-sm text-[#a5a0cc] leading-relaxed [&_h2]:text-white [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_strong]:text-[#e0d8ff] [&_a]:text-[#A78BFA] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">

        <p>1st Unicorn Distribution LTD (&quot;UnicornDS&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the UnicornDS Chrome extension and website at unicornds.io. We are the data controller for your personal data. This policy explains how we collect, use, store, and protect your information in compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>

        <div className="bg-[#16213e] border border-[#2d2766] rounded-xl p-5 my-6">
          <p className="text-white font-bold mb-2">Data Controller</p>
          <p>1st Unicorn Distribution LTD<br/>Manchester, United Kingdom<br/>Email: <a href="mailto:hello@unicornds.io">hello@unicornds.io</a><br/>Company Number: [Your Companies House Number]</p>
        </div>

        <h2>1. Information We Collect</h2>
        <p><strong>Account Information:</strong> When you create an account, we collect your email address and display name. If you sign in with Google, we receive your name and email from Google — we do not receive your Google password.</p>
        <p><strong>Usage Data:</strong> We record listing counts, search counts, and feature usage to enforce plan limits and improve our service. We do not track your browsing history.</p>
        <p><strong>Device Information:</strong> We collect a device fingerprint (screen resolution, timezone, language, platform) solely to prevent trial abuse. This does not identify you personally.</p>
        <p><strong>Payment Information:</strong> Payments are processed by Revolut Pay. We never see, store, or have access to your credit/debit card numbers, CVV, or bank details. Revolut handles all payment data under their own PCI DSS-compliant security standards.</p>
        <p><strong>Communication Data:</strong> If you contact us via email or our support chat, we retain those communications to resolve your enquiry.</p>
        <p><strong>Cookies:</strong> We use essential cookies for authentication (Firebase session) and analytics (Google Analytics). We do not use advertising or tracking cookies. See Section 9 for details.</p>

        <h2>2. Legal Basis for Processing (GDPR Article 6)</h2>
        <p>We process your personal data under the following legal bases:</p>
        <ul>
          <li><strong>Contract:</strong> Processing your account data and usage is necessary to provide the UnicornDS service you signed up for (Article 6(1)(b)).</li>
          <li><strong>Legitimate Interest:</strong> We use device fingerprinting and analytics to prevent fraud, improve our product, and protect our business (Article 6(1)(f)).</li>
          <li><strong>Consent:</strong> We send you service-related emails (trial reminders, account updates). You can opt out at any time (Article 6(1)(a)).</li>
          <li><strong>Legal Obligation:</strong> We may process data to comply with applicable laws or regulations (Article 6(1)(c)).</li>
        </ul>

        <h2>3. What We Do NOT Collect</h2>
        <ul>
          <li>Your browsing history outside of eBay, Amazon, and AliExpress product pages.</li>
          <li>Your eBay account credentials, eBay API tokens, or eBay sales data.</li>
          <li>Credit card numbers, CVV codes, or bank account details (Revolut handles this).</li>
          <li>Your location, contacts, camera, or microphone.</li>
        </ul>
        <p><strong>We do not sell, rent, or share your personal data with advertisers or data brokers. Never have, never will.</strong></p>

        <h2>4. How We Use Your Data</h2>
        <ul>
          <li>Provide, maintain, and improve the UnicornDS service.</li>
          <li>Enforce plan limits (listings, searches, scans per your subscription).</li>
          <li>Process payments through Revolut.</li>
          <li>Send transactional emails (welcome, trial reminders, account updates).</li>
          <li>Prevent fraud and abuse (disposable email blocking, device fingerprinting).</li>
          <li>Respond to your support requests.</li>
          <li>Generate anonymised analytics to improve our product.</li>
        </ul>

        <h2>5. Data Storage & Security</h2>
        <p>Your data is stored in <strong>Google Firebase</strong> (Firestore database and Authentication), hosted on Google Cloud Platform infrastructure. Security measures include:</p>
        <ul>
          <li>Encryption at rest and in transit (TLS 1.3).</li>
          <li>Firestore security rules that block unauthorised access.</li>
          <li>Firebase Authentication with secure token-based sessions.</li>
          <li>Server-side validation of all tier limits and permissions.</li>
          <li>No plain-text storage of passwords (handled by Firebase Auth).</li>
        </ul>
        <p>While no system is 100% secure, we implement industry-standard security practices to protect your data.</p>

        <h2>6. Payment Security</h2>
        <div className="bg-[#16213e] border border-[#2d2766] rounded-xl p-5 my-3">
          <p className="text-white font-bold mb-2">Your card details are safe</p>
          <p>We use <strong>Revolut Pay</strong> for payment processing. Revolut is authorised by the Financial Conduct Authority (FCA) and is PCI DSS Level 1 compliant — the highest level of payment security certification. Your card details are entered directly on Revolut&apos;s secure payment page. UnicornDS never sees, processes, or stores your card number, expiry date, or CVV.</p>
        </div>

        <h2>7. Third-Party Processors</h2>
        <p>We use the following third-party services to operate UnicornDS. Each has their own privacy policy:</p>
        <ul>
          <li><strong>Google Firebase</strong> (USA) — Authentication, database, cloud functions. <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
          <li><strong>Revolut</strong> (UK/EU) — Payment processing. <a href="https://www.revolut.com/legal/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
          <li><strong>OpenAI</strong> (USA) — AI title generation. Product titles only, no personal data sent. <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
          <li><strong>Brevo</strong> (France) — Transactional emails. <a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
          <li><strong>Vercel</strong> (USA) — Website hosting. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
          <li><strong>Google Analytics</strong> — Anonymised website usage analytics. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
        </ul>

        <h2>8. International Data Transfers</h2>
        <p>Some of our processors (Firebase, OpenAI, Vercel) are based in the United States. These transfers are protected by Standard Contractual Clauses (SCCs) as approved by the UK Information Commissioner&apos;s Office (ICO). Your data is treated with the same level of protection regardless of where it is processed.</p>

        <h2>9. Cookies</h2>
        <p>We use minimal cookies:</p>
        <ul>
          <li><strong>Firebase Authentication</strong> (essential) — Keeps you logged in. Cannot be disabled without breaking the service.</li>
          <li><strong>Google Analytics</strong> (analytics) — Anonymised page views and usage patterns. You can opt out using browser extensions or cookie settings.</li>
        </ul>
        <p>We do not use advertising cookies, social media tracking pixels, or retargeting cookies.</p>

        <h2>10. Data Retention</h2>
        <ul>
          <li><strong>Active accounts:</strong> Data retained while your account is active.</li>
          <li><strong>Cancelled accounts:</strong> Data deleted within 90 days of account deletion request.</li>
          <li><strong>Trial accounts (expired):</strong> Data retained for 12 months, then automatically deleted.</li>
          <li><strong>Payment records:</strong> Retained for 7 years as required by UK tax law (HMRC).</li>
          <li><strong>Support communications:</strong> Retained for 2 years.</li>
        </ul>

        <h2>11. Your Rights Under GDPR</h2>
        <p>Under UK GDPR, you have the following rights:</p>
        <ul>
          <li><strong>Right of Access</strong> — Request a copy of all personal data we hold about you.</li>
          <li><strong>Right to Rectification</strong> — Request correction of inaccurate data.</li>
          <li><strong>Right to Erasure</strong> — Request deletion of your data (&quot;right to be forgotten&quot;).</li>
          <li><strong>Right to Data Portability</strong> — Receive your data in a machine-readable format.</li>
          <li><strong>Right to Object</strong> — Object to processing based on legitimate interests.</li>
          <li><strong>Right to Restrict Processing</strong> — Request we limit how we use your data.</li>
          <li><strong>Right to Withdraw Consent</strong> — Withdraw consent at any time for consent-based processing.</li>
        </ul>
        <p>To exercise any of these rights, email <a href="mailto:hello@unicornds.io">hello@unicornds.io</a>. We will respond within 30 days.</p>

        <h2>12. Children&apos;s Privacy</h2>
        <p>UnicornDS is not directed at children under 16. We do not knowingly collect personal data from anyone under 16 years of age. If you believe we have collected data from a child, please contact us immediately.</p>

        <h2>13. Changes to This Policy</h2>
        <p>We may update this privacy policy from time to time. We will notify you of significant changes by email or by posting a notice on our website. Your continued use of UnicornDS after changes constitutes acceptance of the updated policy.</p>

        <h2>14. Complaints</h2>
        <p>If you believe your data protection rights have been violated, you have the right to lodge a complaint with the UK Information Commissioner&apos;s Office (ICO):</p>
        <p><a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">ico.org.uk/make-a-complaint</a><br/>Helpline: 0303 123 1113</p>

        <h2>15. Contact Us</h2>
        <p>For any questions about this privacy policy or your personal data:<br/>
        Email: <a href="mailto:hello@unicornds.io">hello@unicornds.io</a><br/>
        1st Unicorn Distribution LTD, Manchester, United Kingdom</p>

      </div>
    </div>
  );
}
