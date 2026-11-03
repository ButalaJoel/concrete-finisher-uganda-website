import { Coins, Shield, Sparkles, Wrench } from "lucide-react";

const BENEFITS = [
  { icon: Shield, title: "Durable", text: "Built to handle heavy traffic, impact and demanding environments." },
  { icon: Sparkles, title: "Low maintenance", text: "Sealed, seamless surfaces that are quick to clean and cheaper to run." },
  { icon: Wrench, title: "Professionally installed", text: "Applied by trained crews using industrial equipment and tested methods." },
  { icon: Coins, title: "Cost effective", text: "Long service life means lower cost over the life of the building." },
];

function ServicesBenefits() {
  return (
    <div className="section section--dark">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h2">Floors built for performance</h2>
        </div>
        <ul className="reasons reasons--dark">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ServicesBenefits;
