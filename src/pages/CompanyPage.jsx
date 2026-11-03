import SiteShell from "../components/SiteShell";
import CompanyHero from "../components/CompanyHero";
import CompanyOverview from "../components/CompanyOverview";
import CompanyProcess from "../components/CompanyProcess";
import CompanyFAQ from "../components/CompanyFAQ";
import CompanyCTA from "../components/CompanyCTA";

function CompanyPage() {
  return (
    <SiteShell>
      <CompanyHero />
      <section id="company"><CompanyOverview /></section>
      <section id="process"><CompanyProcess /></section>
      <section id="faq"><CompanyFAQ /></section>
      <CompanyCTA />
    </SiteShell>
  );
}

export default CompanyPage;
