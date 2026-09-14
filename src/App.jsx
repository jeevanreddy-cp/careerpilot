import "./App.css";
import Navbar from "./components/Navbar";
import CareerForm from "./components/CareerForm";
import History from "./components/History";
import CareerChat from "./components/CareerChat";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="hero" id="home">
        <section className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            AI-powered career guidance
          </div>

          <p className="tagline">BUILD YOUR FUTURE WITH CLARITY</p>

          <h1>
            Discover your career path
            <span> with confidence.</span>
          </h1>

          <p className="description">
            Explore your strengths, develop practical skills, and build a
            personalized learning roadmap with intelligent AI guidance.
          </p>

          <div className="hero-actions">
            <a className="hero-primary-button" href="#generator">
              Generate My Roadmap
              <span>↗</span>
            </a>

            <a className="hero-secondary-button" href="#assistant">
              Ask CareerPilot
              <span>→</span>
            </a>
          </div>

          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-icon">✦</span>
              <div>
                <strong>Personalized</strong>
                <small>Learning roadmaps</small>
              </div>
            </div>

            <div className="hero-feature">
              <span className="feature-icon">⌁</span>
              <div>
                <strong>AI-powered</strong>
                <small>Career conversations</small>
              </div>
            </div>

            <div className="hero-feature">
              <span className="feature-icon">✓</span>
              <div>
                <strong>Track progress</strong>
                <small>One step at a time</small>
              </div>
            </div>
          </div>
        </section>

        <section id="generator">
          <CareerForm />
        </section>

        <section id="history">
          <History />
        </section>

        <section id="assistant">
          <CareerChat />
        </section>
      </main>
    </div>
  );
}

export default App;