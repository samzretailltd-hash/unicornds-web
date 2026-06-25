import { TELEGRAM_URL } from '@/lib/community';

// Telegram community call-to-action: join button + scannable QR.
// Drop <TelegramCTA /> anywhere on a page.
export default function TelegramCTA() {
  return (
    <div className="mt-10 bg-gradient-to-r from-[#1E1B4B] to-[#7C3AED] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-bold text-white mb-2">Join our Telegram community</h3>
        <p className="text-sm text-[#d6d0f5] mb-4">
          Get help fast, share wins, and hear about new features and tips first. Free to join.
        </p>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#1E1B4B] font-bold px-5 py-3 rounded-xl hover:bg-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z" />
          </svg>
          Join on Telegram
        </a>
      </div>
      <div className="bg-white rounded-xl p-3 flex flex-col items-center shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/telegram-qr.png" alt="Scan to join the UnicornDS Telegram" width={132} height={132} />
        <span className="text-xs text-[#1E1B4B] font-semibold mt-1">Scan to join</span>
      </div>
    </div>
  );
}
