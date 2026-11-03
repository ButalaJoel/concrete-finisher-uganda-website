import { PROCESS } from "../data/services";

// The four-step job sequence. Numbered because it is a real sequence.
function ProcessSteps({ title = "How every job runs", intro, image }) {
  return (
    <section className="section process">
      <div className={`wrap${image ? " process__split" : ""}`}>
        {image && (
          <figure className="process__photo">
            <img src={image} alt="Floor preparation on site" loading="lazy" />
          </figure>
        )}
        <div>
          <div className="section-head">
            <h2 className="h2">{title}</h2>
            {intro && <p className="lede">{intro}</p>}
          </div>
          <ol className={`steps${image ? " steps--stacked" : ""}`}>
            {PROCESS.map((step, index) => (
              <li key={step.title} className="steps__item">
                <span className="steps__num" aria-hidden="true">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default ProcessSteps;
