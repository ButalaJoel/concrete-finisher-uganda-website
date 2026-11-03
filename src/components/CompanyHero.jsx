import { Link } from "react-router-dom";
import PageHero from "./PageHero";
import heroImage from "../assets/projects/darling-namanve/after-4.jpg";

function CompanyHero() {
  return (
    <PageHero
      image={heroImage}
      crumb={[{ label: "About us", to: "/about" }, { label: "Company" }]}
      title="Building durable concrete floors across Uganda"
      intro="Our experience, the way we work on site and answers to the questions clients ask most."
    >
      <div className="page-hero__actions">
        <Link to="/contact#quote" className="btn btn--primary">Request a site inspection</Link>
      </div>
    </PageHero>
  );
}

export default CompanyHero;
