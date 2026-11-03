const STATS = [
  { value: "100+", label: "Projects completed" },
  { value: "8+", label: "Years of experience" },
  { value: "6", label: "Floor systems installed" },
  { value: "24/7", label: "Customer support line" },
];

function CompanyStats() {
  return (
    <section className="stat-band" aria-label="Company figures">
      <dl className="wrap stat-band__grid">
        {STATS.map((s) => (
          <div key={s.label}>
            <dt>{s.value}</dt>
            <dd>{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default CompanyStats;
