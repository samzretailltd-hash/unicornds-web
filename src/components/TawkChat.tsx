'use client';
import Script from 'next/script';

// Tawk.to live chat.
// Set these in Vercel → Project → Settings → Environment Variables:
//   NEXT_PUBLIC_TAWK_PROPERTY_ID   (e.g. 6634a1b2c3d4e5f6a7b8c9d0)
//   NEXT_PUBLIC_TAWK_WIDGET_ID     (e.g. 1hxxxxxxx)
// Find both in Tawk dashboard → Administration → Chat Widget → the embed src
//   https://embed.tawk.to/<PROPERTY_ID>/<WIDGET_ID>
// Tip: set the widget position to bottom-LEFT in Tawk so it doesn't overlap the AI helper.
export default function TawkChat() {
  const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || '6a3748717fde011d4bdcb64b';
  const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || '1jrjv5v1c';

  if (!propertyId) return null; // not configured yet — render nothing

  return (
    <Script id="tawk-to" strategy="afterInteractive">
      {`var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();
Tawk_API.customStyle={visibility:{desktop:{position:'bl',xOffset:20,yOffset:20},mobile:{position:'bl',xOffset:10,yOffset:20}}};
(function(){
  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src='https://embed.tawk.to/${propertyId}/${widgetId}';
  s1.charset='UTF-8';
  s1.setAttribute('crossorigin','*');
  s0.parentNode.insertBefore(s1,s0);
})();`}
    </Script>
  );
}
