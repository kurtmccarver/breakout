import { PolicyPage } from "@/components/policy-page";

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Breakout Policies"
      title="Terms & Conditions"
      updated="August 18, 2026"
      intro="These terms cover your use of Breakout, a local-first trading journal and risk tool."
      sections={[
        {
          title: "1. Acceptance of these terms",
          body: [
            "By using Breakout, you agree to these terms. If you do not agree, do not use the app.",
          ],
        },
        {
          title: "2. What Breakout does",
          body: [
            "Breakout is a personal trading workspace for logging trades, organizing accounts, reviewing performance, and estimating risk.",
            "The app is designed to run as a local-first client experience. Your journal data is stored in your browser on the device you are using.",
          ],
        },
        {
          title: "3. Local storage and data retention",
          body: [
            "Breakout stores trade logs, account names, capital values, selected account state, and calculator inputs in browser storage so the app can remember your work locally.",
            "The app does not require a user account, and it does not send your journal data to a Breakout server for sync or central storage.",
            "If you clear your browser storage, use a different browser, or switch devices, locally stored data may be removed or unavailable.",
          ],
        },
        {
          title: "4. Your responsibilities",
          body: [
            "You are responsible for protecting your own device, browser profile, and any backups you choose to keep.",
            "Trading decisions are your responsibility. Breakout is a tracking and planning tool only and does not provide financial, legal, or tax advice.",
          ],
        },
        {
          title: "5. Third-party and market data",
          body: [
            "Some views may display market or economic calendar information sourced from third parties such as TradingView.",
            "Third-party data is provided for convenience only. Availability, accuracy, timing, and completeness are controlled by those providers, not Breakout.",
          ],
        },
        {
          title: "6. Acceptable use",
          body: [
            "You may not use Breakout in a way that interferes with the app, attempts to access data you do not control, or violates applicable law.",
          ],
        },
        {
          title: "7. Changes to the service",
          body: [
            "We may update Breakout, its features, or these terms at any time. Continued use after an update means you accept the revised terms.",
          ],
        },
        {
          title: "8. Limitation of liability",
          body: [
            "To the maximum extent allowed by law, Breakout is provided on an as-is and as-available basis. Use it at your own risk.",
          ],
        },
      ]}
    />
  );
}
