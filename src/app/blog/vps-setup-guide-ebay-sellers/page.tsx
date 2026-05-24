import type { Metadata } from "next";
import { BlogLayout } from "@/components/BlogLayout";

export const metadata: Metadata = {
  title: "How to Set Up a Windows VPS for eBay Dropshipping (Step-by-Step)",
  description: "Complete beginner guide to setting up a Windows VPS for eBay dropshipping. From ordering to installing Chrome, UnicornDS, and running your first sync. 15 minutes.",
  keywords: ["setup vps ebay", "windows vps tutorial", "rdp setup ebay", "how to use vps dropshipping", "install chrome on vps"],
  alternates: { canonical: "https://www.unicornds.io/blog/vps-setup-guide-ebay-sellers" },
  openGraph: {
    title: "How to Set Up a Windows VPS for eBay Dropshipping",
    description: "Step-by-step guide: order, connect, install Chrome + UnicornDS, start syncing. 15 minutes.",
    url: "https://www.unicornds.io/blog/vps-setup-guide-ebay-sellers",
    type: "article",
    images: [{ url: "https://www.unicornds.io/og-image.png", width: 1200, height: 630 }],
  },
};

export default function BlogPost() {
  return (
    <BlogLayout title="How to Set Up a Windows VPS for eBay Dropshipping (Step-by-Step)" date="24 May 2026" readTime="7 min">
      <p>
        Setting up a VPS sounds technical, but it&apos;s actually easier than setting up a new laptop. This guide walks you through every step — from ordering your server to running your first eBay order sync on it.
      </p>
      <p>
        Total time: about 15 minutes of your work (plus 1-4 hours waiting for the server to be provisioned).
      </p>

      <h2>What you need before starting</h2>
      <ul>
        <li>A VPS plan (we use <a href="https://unicornvps.com/#pricing" target="_blank" rel="noopener noreferrer">UnicornVPS Starter</a> in this guide — $10/mo with code FLASH50)</li>
        <li>A laptop or phone (any device with internet)</li>
        <li>Your eBay seller account login details</li>
        <li>Your UnicornDS account (if you have one)</li>
      </ul>

      <h2>Step 1 — Order your VPS (2 minutes)</h2>
      <p>
        Go to your VPS provider&apos;s website and select a Windows plan. For eBay dropshipping, we recommend at least 4GB RAM and an SSD drive. Choose the server location closest to your eBay marketplace — London for eBay UK, Virginia for eBay US.
      </p>
      <p>
        After payment, you&apos;ll receive an email with your server&apos;s IP address, username (usually &quot;Administrator&quot;), and password. Save these — you&apos;ll need them in the next step.
      </p>
      <p>
        <strong>Wait time:</strong> Depending on the provider, this takes 5 minutes (automated) to 4 hours (manual provisioning). UnicornVPS typically delivers within 1-4 hours.
      </p>

      <h2>Step 2 — Connect to your VPS via Remote Desktop (3 minutes)</h2>

      <h3>On Windows</h3>
      <ol>
        <li>Press <strong>Windows + R</strong> to open Run</li>
        <li>Type <code>mstsc</code> and press Enter</li>
        <li>Enter the IP address from your email</li>
        <li>Click Connect</li>
        <li>Enter the username and password</li>
        <li>Click OK (accept the certificate warning — this is normal)</li>
      </ol>

      <h3>On Mac</h3>
      <ol>
        <li>Download <strong>Microsoft Remote Desktop</strong> from the App Store (free)</li>
        <li>Open it and click <strong>Add PC</strong></li>
        <li>Enter the IP address from your email</li>
        <li>Double-click to connect</li>
        <li>Enter username and password when prompted</li>
      </ol>

      <h3>On phone (iPhone/Android)</h3>
      <ol>
        <li>Download the <strong>RD Client</strong> app (Microsoft, free)</li>
        <li>Tap + to add a new PC</li>
        <li>Enter the IP address</li>
        <li>Connect and enter credentials</li>
      </ol>

      <p>
        You&apos;ll see a Windows desktop — just like your own computer, but running in a data centre. Everything you do on this desktop stays on the server 24/7.
      </p>

      <h2>Step 3 — Install Chrome (2 minutes)</h2>
      <p>
        Your VPS will have Internet Explorer or Microsoft Edge pre-installed. Open it and go to:
      </p>
      <p>
        <code>https://www.google.com/chrome</code>
      </p>
      <p>
        Download and install Chrome. If the download is blocked by Windows Server security settings, you&apos;ll need to temporarily disable IE Enhanced Security Configuration:
      </p>
      <ol>
        <li>Open <strong>Server Manager</strong> (it usually opens automatically on login)</li>
        <li>Click <strong>Local Server</strong> in the left sidebar</li>
        <li>Find <strong>IE Enhanced Security Configuration</strong> → click <strong>On</strong></li>
        <li>Set both to <strong>Off</strong></li>
        <li>Now go back to Edge and download Chrome</li>
      </ol>

      <h2>Step 4 — Install UnicornDS (3 minutes)</h2>
      <ol>
        <li>Open Chrome on the VPS</li>
        <li>Go to <strong>unicornds.io/download</strong></li>
        <li>Log in with your UnicornDS account</li>
        <li>Click <strong>Download UnicornDS v7.20.0</strong></li>
        <li>Unzip the downloaded file (right-click → Extract All)</li>
        <li>Go to <strong>chrome://extensions</strong> in Chrome</li>
        <li>Toggle <strong>Developer mode</strong> ON (top right)</li>
        <li>Click <strong>Load unpacked</strong></li>
        <li>Select the UnicornDS folder</li>
        <li>The UnicornDS icon appears in your toolbar — you&apos;re installed!</li>
      </ol>

      <h2>Step 5 — Log into eBay on the VPS (2 minutes)</h2>
      <p>
        Open Chrome and go to <strong>ebay.co.uk</strong> (or your marketplace). Log in with your eBay seller account. eBay will see the VPS&apos;s IP address — which is now your consistent login location.
      </p>
      <p>
        <strong>Important:</strong> From now on, always log into THIS eBay account from THIS VPS. Don&apos;t log in from your personal laptop AND the VPS on the same account — pick one. Multiple login locations can trigger security holds.
      </p>

      <h2>Step 6 — Run your first sync (3 minutes)</h2>
      <ol>
        <li>Navigate to your eBay <strong>Seller Hub → Orders</strong></li>
        <li>Click the UnicornDS extension icon</li>
        <li>Open <strong>Order Manager</strong></li>
        <li>Click <strong>Sync Now</strong></li>
        <li>Wait for the progress bar to complete</li>
        <li>Your orders, buyer addresses, and earnings are now loaded</li>
      </ol>
      <p>
        The VPS will keep Chrome open and running even after you disconnect from Remote Desktop. When you reconnect tomorrow, everything is exactly where you left it.
      </p>

      <h2>Optional: Set up auto-startup</h2>
      <p>
        To make Chrome and eBay open automatically whenever the VPS restarts (after updates or maintenance):
      </p>
      <ol>
        <li>Press <strong>Windows + R</strong>, type <code>shell:startup</code>, press Enter</li>
        <li>Right-click in the folder → New → Shortcut</li>
        <li>Enter: <code>&quot;C:\Program Files\Google\Chrome\Application\chrome.exe&quot; --restore-last-session</code></li>
        <li>Name it &quot;Chrome Startup&quot; and save</li>
      </ol>
      <p>
        Now Chrome will auto-launch with your last session whenever the server reboots. Your eBay tabs and UnicornDS will be right where you left them.
      </p>

      <h2>Security tips</h2>
      <ul>
        <li><strong>Change the default password</strong> immediately after first login. Use a strong password (16+ characters).</li>
        <li><strong>Enable Windows Firewall</strong> — it should be on by default, don&apos;t turn it off.</li>
        <li><strong>Don&apos;t install random software</strong> — only Chrome, your eBay tools, and any automation software you trust.</li>
        <li><strong>Lock the screen</strong> when you disconnect — press <strong>Windows + L</strong> before closing RDP.</li>
      </ul>

      <h2>You&apos;re done</h2>
      <p>
        Your eBay business is now running 24/7 on a dedicated server. Orders sync automatically, stock checks run in the background, and your buyer messages are handled. The VPS costs less than a Netflix subscription and saves you hours every week.
      </p>
    </BlogLayout>
  );
}
