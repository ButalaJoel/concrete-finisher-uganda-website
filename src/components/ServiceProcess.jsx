import processImage from "../assets/services/process.jpg";

function ServiceProcess() {
  return (
    <section className="service-process">

      <div className="container process-layout">

        <div className="process-image">
          <img src={processImage} alt="Process" />
        </div>

        <div className="process-content">

          <span className="section-tag">
            OUR PROCESS
          </span>

          <h2>
            How We Deliver Every Project
          </h2>

          <div className="process-step">
            <span>01</span>
            <div>
              <h3>Site Inspection</h3>
              <p>Understanding project requirements.</p>
            </div>
          </div>

          <div className="process-step">
            <span>02</span>
            <div>
              <h3>Surface Preparation</h3>
              <p>Grinding and preparation for installation.</p>
            </div>
          </div>

          <div className="process-step">
            <span>03</span>
            <div>
              <h3>Installation</h3>
              <p>Professional application and finishing.</p>
            </div>
          </div>

          <div className="process-step">
            <span>04</span>
            <div>
              <h3>Quality Inspection</h3>
              <p>Final review and project handover.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default ServiceProcess;