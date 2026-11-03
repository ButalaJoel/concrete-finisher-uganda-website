import { Plus } from "lucide-react";

// Accessible accordion built on <details>, so it works without JavaScript.
function Faq({ title = "Frequently asked questions", items }) {
  return (
    <section className="section">
      <div className="wrap faq">
        <div className="section-head">
          <h2 className="h2">{title}</h2>
          <p className="lede">
            Can't find your answer? Call or WhatsApp us and a specialist will help.
          </p>
        </div>
        <div className="faq__list">
          {items.map((item) => (
            <details key={item.q} className="faq__item">
              <summary>
                <span>{item.q}</span>
                <Plus size={20} aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
