import {
  ShieldCheck,
  Hammer,
  Clock3,
  Award,
  Building2,
  Users,
} from "lucide-react";

function ContactReasons() {
  return (
    <section className="contact-reasons-section">

      <div className="contact-reasons-header">

        <span>WHY CHOOSE US</span>

        <h2>Why Businesses Trust Concrete Finisher Uganda</h2>

        <p>
          From industrial warehouses to residential compounds,
          we deliver flooring systems built for performance,
          durability and long-term value.
        </p>

      </div>

      <div className="contact-reasons-grid">

        <div className="contact-reasons-card">

          <ShieldCheck size={36} />

          <h3>Quality Guaranteed</h3>

          <p>
            Every flooring system is installed using proven
            processes and premium materials.
          </p>

        </div>

        <div className="contact-reasons-card">

          <Hammer size={36} />

          <h3>Modern Equipment</h3>

          <p>
            Professional grinding, polishing and installation
            equipment ensures excellent finishes.
          </p>

        </div>

        <div className="contact-reasons-card">

          <Clock3 size={36} />

          <h3>Delivered On Time</h3>

          <p>
            Projects are completed efficiently while maintaining
            high workmanship standards.
          </p>

        </div>

        <div className="contact-reasons-card">

          <Building2 size={36} />

          <h3>Industrial Expertise</h3>

          <p>
            Extensive experience working in factories,
            commercial facilities and residential spaces.
          </p>

        </div>

        <div className="contact-reasons-card">

          <Users size={36} />

          <h3>Experienced Team</h3>

          <p>
            Skilled flooring specialists with practical
            industry experience.
          </p>

        </div>

        <div className="contact-reasons-card">

          <Award size={36} />

          <h3>Trusted Solutions</h3>

          <p>
            Reliable flooring systems designed for durability,
            performance and easy maintenance.
          </p>

        </div>

      </div>

    </section>
  );
}

export default ContactReasons;