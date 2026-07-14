import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import CompanyHero from "../components/CompanyHero";
import CompanyOverview from "../components/CompanyOverview";
import CompanyProcess from "../components/CompanyProcess";
import CompanyFAQ from "../components/CompanyFAQ";
import CompanyCTA from "../components/CompanyCTA";

import "../styles/CompanyPage.css";

function CompanyPage() {
  return (
    <>
      <Navbar />

      <CompanyHero />

      <section id="company">
        <CompanyOverview />
      </section>

      <section id="process">
        <CompanyProcess />
      </section>

      <section id="faq">
        <CompanyFAQ />
      </section>

      <CompanyCTA />

      <Footer />
    </>
  );
}

export default CompanyPage;