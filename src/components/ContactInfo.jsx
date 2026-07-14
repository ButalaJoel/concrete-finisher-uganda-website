import {
  Phone,
  MessageCircleMore,
  Mail,
  MapPin
} from "lucide-react";

function ContactInfo() {
  return (
    <section className="contact-info">

      <div className="contact-info-container">

        <a
          href="tel:+256780662557"
          className="contact-info-card"
        >
          <Phone size={24} />

          <h3>CALL US</h3>

          <p>+256 780 662 557</p>

          <span>Speak directly with our team</span>

        </a>

        <a
          href="https://wa.me/256780662557"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-info-card"
        >
          <MessageCircleMore size={24} />

          <h3>WHATSAPP US</h3>

          <p>Chat Instantly</p>

          <span>Send photos and project details</span>

        </a>

        <a
          href="mailto:info@concretefinisherug.com"
          className="contact-info-card"
        >
          <Mail size={24} />

          <h3>EMAIL US</h3>

          <p>info@concretefinisherug.com</p>

          <span>Request quotations and enquiries</span>

        </a>

        <a
          href="https://maps.google.com/?q=Plot+56+6th+Street+Industrial+Area+Kampala"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-info-card"
        >
          <MapPin size={24} />

          <h3>VISIT US</h3>

          <p>Plot 56, 6th Street</p>

          <span>Industrial Area, Kampala</span>

        </a>

      </div>

    </section>
  );
}

export default ContactInfo;