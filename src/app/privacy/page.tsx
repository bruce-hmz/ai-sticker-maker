import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | StickerSit",
  description:
    "Privacy policy for StickerSit — learn how we handle your data when using our free AI sticker maker.",
  alternates: { canonical: "https://stickersit.com/privacy" },
  openGraph: {
    title: "Privacy Policy | StickerSit",
    description:
      "Privacy policy for StickerSit — learn how we handle your data when using our free AI sticker maker.",
    url: "https://stickersit.com/privacy",
    siteName: "StickerSit",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | StickerSit",
    description:
      "Privacy policy for StickerSit — learn how we handle your data when using our free AI sticker maker.",
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://stickersit.com" },
      { "@type": "ListItem", position: 2, name: "Privacy Policy" },
    ],
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: September 8, 2026
      </p>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-3">
            1. Information We Collect
          </h2>
          <p>
            StickerSit (stickersit.com) is designed to collect minimal personal
            information. We do not require account registration, email addresses,
            or personal details to use the service.
          </p>
          <p className="mt-2">
            The text prompts you type to generate stickers are sent to our
            AI image generation provider (SenseNova, a SenseTime service) to
            produce your stickers. We do not permanently store your prompts on
            our servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            2. Analytics &amp; Advertising
          </h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              <strong>Google Analytics</strong> — We collect anonymous usage
              data (page views, device type, country) to understand how visitors
              use the site. This data is aggregated and does not identify you
              personally. Learn more at{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-500 hover:underline"
              >
                Google&apos;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong>Google AdSense</strong> — We display advertisements
              through Google AdSense. AdSense may use cookies to serve
              personalized ads based on your browsing history. You can manage ad
              personalization at{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-500 hover:underline"
              >
                Google Ad Settings
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">3. Cookies</h2>
          <p>
            StickerSit uses cookies and similar tracking technologies through
            Google Analytics and Google AdSense. These cookies help us understand
            site usage and deliver relevant advertisements. You can control
            cookie settings through your browser preferences. Disabling cookies
            may affect some site features.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            4. Third-Party Services
          </h2>
          <p>
            Your sticker prompts are processed by SenseNova (SenseTime) for
            image generation. Their use of your data is governed by their own
            privacy policy. We encourage you to review their terms if you have
            concerns about prompt data handling.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">5. Data Security</h2>
          <p>
            We use HTTPS encryption (SSL/TLS) for all connections to
            stickersit.com. Security headers including HSTS, X-Frame-Options,
            and Content-Security-Policy are enabled to protect against common
            web vulnerabilities. However, no method of internet transmission is
            100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            6. Children&apos;s Privacy
          </h2>
          <p>
            StickerSit does not knowingly collect personal information from
            children under 13. The service does not require registration or
            personal data entry. If you believe a child has provided personal
            information through our service, please contact us so we can take
            appropriate action.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated revision date. Your
            continued use of the service after changes constitutes acceptance of
            the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">8. Contact</h2>
          <p>
            For questions about this Privacy Policy, please reach out through
            our website at stickersit.com.
          </p>
        </section>
      </div>
    </main>
  );
}
