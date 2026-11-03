import { BadgeCheck, Clock3, HardHat, Wrench } from "lucide-react";

const REASONS = [
  {
    icon: HardHat,
    title: "Experienced crews",
    text: "Trained flooring specialists with practical experience on industrial, commercial and residential sites.",
  },
  {
    icon: Wrench,
    title: "Professional equipment",
    text: "Industrial grinders, polishers and dust extraction for a cleaner site and a better finish.",
  },
  {
    icon: BadgeCheck,
    title: "Inspected before handover",
    text: "Every floor is checked against the agreed specification before we sign it off with you.",
  },
  {
    icon: Clock3,
    title: "Delivered on schedule",
    text: "We plan around your operations and keep the agreed timeline without cutting curing times.",
  },
];

function WhyChooseUs({ title = "Why clients choose us" }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2">{title}</h2>
        </div>
        <ul className="reasons">
          {REASONS.map(({ icon: Icon, title: t, text }) => (
            <li key={t}>
              <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
              <h3>{t}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default WhyChooseUs;
