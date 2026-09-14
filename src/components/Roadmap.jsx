function Roadmap({
  skills,
  careerGoal,
  interests,
  education,
  experience,
  learningTime,
  backendRoadmap,
}) {
  return (
    <section className="roadmap-section">
      <div className="roadmap-heading">
        <p className="roadmap-label">YOUR PERSONALIZED PLAN</p>

        <h2>
          Your Roadmap to Becoming a{" "}
          <span>{careerGoal}</span>
        </h2>

        <p className="roadmap-intro">
          Follow these practical steps based on your current skills,
          interests, experience, and available learning time.
        </p>
      </div>

      <div className="roadmap-profile">
        <div>
          <strong>Main Skill</strong>
          <span>{skills}</span>
        </div>

        <div>
          <strong>Main Interest</strong>
          <span>{interests}</span>
        </div>

        <div>
          <strong>Education</strong>
          <span>{education}</span>
        </div>

        <div>
          <strong>Experience</strong>
          <span>{experience}</span>
        </div>

        <div>
          <strong>Weekly Time</strong>
          <span>{learningTime}</span>
        </div>
      </div>

      <div className="roadmap-timeline">
        {backendRoadmap.map((step, index) => (
          <div className="roadmap-step" key={index}>
            <div className="roadmap-step-marker">
              <div className="roadmap-number">{index + 1}</div>

              {index !== backendRoadmap.length - 1 && (
                <div className="roadmap-connector"></div>
              )}
            </div>

            <div className="roadmap-card">
              <div className="roadmap-card-top">
                <span className="roadmap-step-label">
                  STEP {String(index + 1).padStart(2, "0")}
                </span>

                <span className="roadmap-duration">
                  {step.duration}
                </span>
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Roadmap;