import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms of Service — UnicornDS", description: "Terms and conditions for using UnicornDS." };
export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold mb-2 text-white">Terms of Service</h1>
      <p className="text-sm text-[#6b6899] mb-10">Last updated: 13 April 2026</p>
      <div className="space-y-5 text-sm text-[#a5a0cc] leading-relaxed [&_h2]:text-white [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_strong]:text-[#e0d8ff] [&_a]:text-[#A78BFA] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">

        <p>These Terms of Service (&quot;Terms&quot;) govern your use of the UnicornDS Chrome extension and website at unicornds.io, operated by 1st Unicorn Distribution LTD (&quot;UnicornDS&quot;, &quot;we&quot;, &quot;us&quot;). By creating an account or using our service, you agree to these Terms. If you do not agree, do not use UnicornDS.</p>

        <h2>1. Service Description</h2>
        <p>UnicornDS is a Chrome browser extension and web platform that helps eBay sellers find products, create listings, and manage their dropshipping or arbitrage business. The service includes product scraping from Amazon and AliExpress, AI-powered title generation, bulk listing tools, competitor analysis, and related features as described on our website.</p>

        <h2>2. Account Registration</h2>
        <ul>
          <li>You must provide a valid email address to create an account.</li>
          <li>You are responsible for maintaining the security of your account credentials.</li>
          <li>You must be at least 18 years old to use UnicornDS.</li>
          <li>One account per person. Creating multiple accounts to abuse free trials is prohibited and will result in account termination.</li>
          <li>You agree to provide accurate information and to update it if it changes.</li>
        </ul>

        <h2>3. Free Trial</h2>
        <ul>
          <li>New users receive a <strong>14-day free trial</strong> with 100 listings and access to selected features.</li>
          <li>No credit card is required for the trial.</li>
          <li>Each person is entitled to <strong>one free trial only</strong>. Attempts to create multiple trials using different email addresses or devices will be detected and blocked.</li>
          <li>When the trial expires, your account will be restricted. Your existing eBay listings remain live, but you cannot create new ones without upgrading to a paid plan.</li>
          <li>We reserve the right to modify or discontinue the free trial at any time.</li>
        </ul>

        <h2>4. Paid Subscriptions</h2>
        <ul>
          <li>Paid plans (Starter, Growth, Empire) are billed monthly or annually through Revolut Pay.</li>
          <li>Prices are listed on our <a href="/pricing">pricing page</a> and may change with 30 days&apos; notice.</li>
          <li>Subscriptions renew automatically unless cancelled before the renewal date.</li>
          <li>Usage limits (listings, searches, scans) reset at the beginning of each billing cycle.</li>
          <li>You can cancel your subscription at any time by contacting us at <a href="mailto:hello@unicornds.io">hello@unicornds.io</a>.</li>
        </ul>

        <h2>5. Refund Policy</h2>
        <ul>
          <li>We offer a <strong>7-day money-back guarantee</strong> on all paid plans.</li>
          <li>If you are not satisfied within 7 days of your first payment, contact us for a full refund.</li>
          <li>Refunds after the 7-day period are not available, as the service has been provided.</li>
          <li>Refunds are processed within 5-10 business days to the original payment method.</li>
        </ul>

        <h2>6. Payment Security</h2>
        <p>All payments are processed by <strong>Revolut Pay</strong>, which is authorised by the Financial Conduct Authority (FCA) and PCI DSS Level 1 compliant. UnicornDS never sees, stores, or processes your credit card numbers, CVV, or banking details. Your payment information is entered directly on Revolut&apos;s secure payment page and is protected by bank-grade encryption.</p>

        <h2>7. Data Protection & Privacy</h2>
        <p>Your privacy is important to us. Please read our <a href="/privacy">Privacy Policy</a> for full details on how we collect, use, and protect your data. Key points:</p>
        <ul>
          <li>We comply with the UK General Data Protection Regulation (UK GDPR).</li>
          <li>We never sell your personal data to third parties.</li>
          <li>We never store your credit card details.</li>
          <li>We only access eBay, Amazon, and AliExpress pages — never your personal browsing history.</li>
          <li>You can request deletion of your data at any time.</li>
        </ul>

        <h2>8. Acceptable Use</h2>
        <p>You agree NOT to:</p>
        <ul>
          <li>Use UnicornDS for any illegal purpose or to violate any laws.</li>
          <li>List products that violate eBay&apos;s policies, including VeRO-protected brands (our VERO checker helps prevent this, but compliance is your responsibility).</li>
          <li>Reverse-engineer, decompile, or attempt to extract the source code of UnicornDS for the purpose of creating a competing product.</li>
          <li>Share, resell, or redistribute your UnicornDS account or the extension files.</li>
          <li>Use automated tools or bots to interact with UnicornDS beyond normal use.</li>
          <li>Attempt to circumvent plan limits, trial restrictions, or security measures.</li>
          <li>Upload malicious content or attempt to compromise our systems.</li>
        </ul>

        <h2>9. AI-Generated Content</h2>
        <p>UnicornDS uses artificial intelligence (OpenAI) to generate product titles and descriptions. While we strive for accuracy:</p>
        <ul>
          <li>AI-generated content is provided as <strong>suggestions</strong> — you should review and edit before publishing.</li>
          <li>We are not responsible for any inaccuracies in AI-generated content.</li>
          <li>You are responsible for ensuring your eBay listings comply with eBay&apos;s policies.</li>
          <li>AI-generated content may not be unique — similar titles could be generated for other users.</li>
        </ul>

        <h2>10. eBay & Third-Party Platforms</h2>
        <ul>
          <li>UnicornDS is an <strong>independent tool</strong> and is not affiliated with, endorsed by, or sponsored by eBay, Amazon, or AliExpress.</li>
          <li>You are responsible for complying with eBay&apos;s Terms of Service and seller policies.</li>
          <li>We are not responsible for any actions taken by eBay against your seller account.</li>
          <li>Changes to eBay&apos;s, Amazon&apos;s, or AliExpress&apos;s websites or APIs may temporarily affect UnicornDS functionality.</li>
        </ul>

        <h2>11. Intellectual Property</h2>
        <ul>
          <li>UnicornDS, including all code, design, branding, and content, is the intellectual property of 1st Unicorn Distribution LTD.</li>
          <li>Your subscription grants you a <strong>non-exclusive, non-transferable, revocable licence</strong> to use the UnicornDS extension for your personal or business use.</li>
          <li>You may not copy, modify, distribute, sell, or lease any part of UnicornDS.</li>
        </ul>

        <h2>12. Service Availability</h2>
        <ul>
          <li>We aim for 99.9% uptime but do not guarantee uninterrupted service.</li>
          <li>We may perform maintenance that temporarily affects availability.</li>
          <li>Third-party platform changes (eBay, Amazon, AliExpress) may affect functionality.</li>
          <li>We will notify users of planned maintenance where possible.</li>
        </ul>

        <h2>13. Limitation of Liability</h2>
        <p>To the maximum extent permitted by UK law:</p>
        <ul>
          <li>UnicornDS is provided &quot;as is&quot; without warranties of any kind.</li>
          <li>We are not liable for any loss of profits, sales, business opportunities, or data arising from your use of UnicornDS.</li>
          <li>Our total liability to you shall not exceed the amount you paid for UnicornDS in the 12 months preceding the claim.</li>
          <li>Nothing in these Terms excludes our liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded by UK law.</li>
        </ul>

        <h2>14. Account Termination</h2>
        <ul>
          <li>You may delete your account at any time by contacting us.</li>
          <li>We may suspend or terminate accounts that violate these Terms, abuse the service, or engage in fraudulent activity.</li>
          <li>Upon termination, your access to UnicornDS will cease immediately.</li>
          <li>Your data will be deleted in accordance with our Privacy Policy.</li>
        </ul>

        <h2>15. Changes to These Terms</h2>
        <p>We may update these Terms from time to time. We will notify you of significant changes by email. Your continued use of UnicornDS after changes take effect constitutes acceptance of the new Terms. If you disagree with changes, you may cancel your account.</p>

        <h2>16. Governing Law</h2>
        <p>These Terms are governed by the laws of <strong>England and Wales</strong>. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

        <h2>17. Contact</h2>
        <p>For questions about these Terms:<br/>
        Email: <a href="mailto:hello@unicornds.io">hello@unicornds.io</a><br/>
        1st Unicorn Distribution LTD, Manchester, United Kingdom</p>

      </div>
    </div>
  );
}
