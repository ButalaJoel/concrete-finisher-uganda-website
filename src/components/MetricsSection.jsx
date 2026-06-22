// MetricsSection.jsx

import {
  ShieldCheck,
  UserRound,
  BadgeCheck,
  Wrench
} from "lucide-react";

function MetricsSection() {
  return (
    <>
      <section className="metrics-section">

  <div className="metric-card">
    <ShieldCheck size={42} strokeWidth={1.7} />

    <div>
      <h3>100+</h3>
      <p>Projects Completed</p>
    </div>
  </div>

  <div className="metric-card">
    <UserRound size={42} strokeWidth={1.7} />

    <div>
      <h3>5+</h3>
      <p>Years Experience</p>
    </div>
  </div>

  <div className="metric-card">
    <Wrench size={42} strokeWidth={1.7} />

    <div>
      <h3>Professional</h3>
      <p>Equipment</p>
    </div>
  </div>

  <div className="metric-card">
    <BadgeCheck size={42} strokeWidth={1.7} />

    <div>
      <h3>100%</h3>
      <p>Quality Guaranteed</p>
    </div>
  </div>

</section>

    </>
  );
}

export default MetricsSection;