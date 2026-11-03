import teamPhoto from "../assets/about/team.jpg";
import floorPhoto from "../assets/about/polished-floor.jpg";

function CompanyStory() {
  return (
    <section className="section">
      <div className="wrap split">
        <div className="prose">
          <h2 className="h2">Floors built to carry real work</h2>
          <p className="lede">
            Concrete Finisher Uganda specialises in epoxy flooring, concrete polishing,
            terrazzo, waterproofing, decorative concrete and surface preparation.
          </p>
          <p>
            We have worked in commercial facilities, industrial plants, warehouses,
            retail spaces and homes, delivering floors that stand up to traffic,
            chemicals and daily cleaning while still looking good.
          </p>
          <p>
            Our crews combine technical training, professional grinding and polishing
            equipment and tested installation methods, so each project is finished
            with long-term performance in mind.
          </p>
          <p>
            Whether it is a new installation, a floor restoration or preparation for
            another trade, we hold every job to the same standard.
          </p>
        </div>
        <div className="photo-stack">
          <img src={teamPhoto} alt="Concrete Finisher team on site" loading="lazy" />
          <img src={floorPhoto} alt="A finished polished concrete floor" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

export default CompanyStory;
