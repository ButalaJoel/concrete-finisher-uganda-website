import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT } from "../data/contact";

// Contact details shown beside the quotation form.
function ContactInfo() {
  return (
    <aside className="contact-aside" aria-label="Contact details">
      <h2>Prefer to talk?</h2>
      <ul>
        <li>
          <a href={CONTACT.phoneHref}>
            <Phone size={20} aria-hidden="true" />
            <span><strong>{CONTACT.phone}</strong>Call our team directly</span>
          </a>
        </li>
        <li>
          <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={20} aria-hidden="true" />
            <span><strong>WhatsApp</strong>Send photos and measurements</span>
          </a>
        </li>
        <li>
          <a href={CONTACT.emailHref}>
            <Mail size={20} aria-hidden="true" />
            <span><strong>{CONTACT.email}</strong>Quotations and enquiries</span>
          </a>
        </li>
        <li>
          <a href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer">
            <MapPin size={20} aria-hidden="true" />
            <span><strong>{CONTACT.addressLine1}</strong>{CONTACT.addressLine2}</span>
          </a>
        </li>
        <li className="contact-aside__static">
          <Clock3 size={20} aria-hidden="true" />
          <span><strong>Site visits by appointment</strong>We reply to requests within one working day</span>
        </li>
      </ul>
    </aside>
  );
}

export default ContactInfo;
