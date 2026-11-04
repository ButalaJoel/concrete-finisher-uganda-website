import Faq from "./Faq";

const ITEMS = [
  { q: "Which areas do you serve?", a: "We work across Uganda on residential, commercial and industrial projects. Our office is on Cecilia Rd, Mutungo, Kampala." },
  { q: "Do you offer site inspections?", a: "Yes. We inspect the site before recommending a flooring system, so the quotation matches the real condition of the slab." },
  { q: "How long do epoxy floors last?", a: "With proper preparation, installation and maintenance, an epoxy floor lasts many years, even under forklift and foot traffic." },
  { q: "Can you repair damaged concrete?", a: "Yes. We repair cracks, holes and uneven areas before applying any new finish." },
];

function CompanyFAQ() {
  return <Faq items={ITEMS} />;
}

export default CompanyFAQ;
