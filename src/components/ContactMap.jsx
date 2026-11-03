import { CONTACT } from "../data/contact";

function ContactMap() {
  return (
    <section className="section section--tint">
      <div className="wrap map">
        <div className="map__text">
          <h2 className="h2">Visit our office</h2>
          <p className="lede">
            {CONTACT.addressLine1}, {CONTACT.addressLine2}. Come in to discuss your
            project, see finish samples and get product advice.
          </p>
          <a href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
            Open in Google Maps
          </a>
        </div>
        <div className="map__frame">
          <iframe
            title="Map showing the Concrete Finisher Uganda office"
            src={CONTACT.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

export default ContactMap;
