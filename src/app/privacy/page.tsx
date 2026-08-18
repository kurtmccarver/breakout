import { PolicyPage } from "@/components/policy-page";

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Breakout Policies"
      title="Privacy Policy"
      updated="August 18, 2026"
      intro="This policy explains what Breakout stores, how it uses data, and what it does not collect."
      sections={[
        {
          title: "1. What we collect",
          body: [
            "Breakout does not require an account and does not collect journal data for a central service by default.",
            "The app stores the information you enter locally in your browser, including trade logs, account names, account capital, selected account state, risk calculator inputs, and UI preferences.",
          ],
        },
        {
          title: "2. How data is used",
          body: [
            "Your local data is used only to render the app on your device and preserve your settings between sessions.",
            "We do not use your journal data for advertising, profiling, or resale.",
          ],
        },
        {
          title: "3. Data sharing",
          body: [
            "Breakout does not send your trade journal to a Breakout backend for synchronization or storage.",
            "If you use the economic calendar section, the app may display third-party market information from providers such as TradingView. That third-party content is not part of your stored journal data.",
          ],
        },
        {
          title: "4. Retention",
          body: [
            "Your local data remains on the device and in the browser profile where you entered it until you delete it from the app or clear the browser storage.",
          ],
        },
        {
          title: "5. Security",
          body: [
            "Browser storage is convenient but not a secure vault. Anyone with access to your unlocked device or browser profile may be able to view the local data.",
            "Do not store secrets, account credentials, or other sensitive information you would not want on the local device.",
          ],
        },
        {
          title: "6. Your choices",
          body: [
            "You can edit or delete trades and accounts inside the app. You can also clear your browser storage to remove locally saved data.",
          ],
        },
        {
          title: "7. Children and sensitive data",
          body: [
            "Breakout is intended for users who are old enough to manage trading-related information and understand the risks of financial planning tools.",
            "The app is not designed to collect sensitive personal data.",
          ],
        },
        {
          title: "8. Policy changes",
          body: [
            "If Breakout adds new storage, analytics, or sharing features in the future, this policy should be updated before release so the changes are explicit and visible.",
          ],
        },
      ]}
    />
  );
}
