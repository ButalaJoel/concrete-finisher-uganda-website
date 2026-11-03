import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { CONTACT } from "../data/contact";

// Closing call-to-action used at the bottom of public pages.
function CtaBand({
  title = "Have a floor that needs finishing?",
  text = "Send us the size, location and what the floor is used for. We'll visit the site and come back with a quotation.",
}) {
  return (
    <section className="cta-band">
      <div className="wrap cta-band__inner">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-band__actions">
          <Link to="/contact#quote" className="btn btn--light">Request a quotation</Link>
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline-light"
          >
            <MessageCircle size={18} aria-hidden="true" />
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  );
}

export default CtaBand;
