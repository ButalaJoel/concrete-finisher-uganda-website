import Faq from "./Faq";

const ITEMS = [
  { q: "How long does epoxy flooring last?", a: "With good preparation and maintenance, epoxy flooring lasts many years in commercial and industrial environments." },
  { q: "Do you offer site inspections?", a: "Yes. We assess each project before recommending a flooring system." },
  { q: "Can polished concrete be used indoors?", a: "Yes. It is a popular choice for offices, showrooms and homes." },
  { q: "Do I need to close my business during installation?", a: "Not always. We can phase the work area by area, or work evenings and weekends, to keep you running." },
];

function ServicesFAQ() {
  return <Faq items={ITEMS} />;
}

export default ServicesFAQ;
