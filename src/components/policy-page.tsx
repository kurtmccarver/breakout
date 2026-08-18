import Link from "next/link";

type PolicySection = {
  title: string;
  body: string[];
  list?: string[];
};

export function PolicyPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: PolicySection[];
}) {
  return (
    <main className="policy-page">
      <div className="policy-shell">
        <Link className="policy-back" href="/">
          Back to app
        </Link>
        <header className="policy-hero">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <span>Last updated {updated}</span>
          <p className="policy-intro">{intro}</p>
        </header>

        <div className="policy-sections">
          {sections.map((section) => (
            <section key={section.title} className="policy-card">
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.list ? (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
