function Navbar() {
  return (
    <nav className="navbar">
      <a href="#home" className="navbar-brand">
        <span className="brand-icon">C</span>

        <span className="brand-text">
          Career<span>Pilot</span>
        </span>
      </a>

      <div className="navbar-links">
        <a href="#home">Home</a>
        <a href="#generator">Roadmap</a>
        <a href="#history">My Progress</a>
        <a href="#assistant">AI Assistant</a>
      </div>

      <a className="navbar-button" href="#generator">
        Get Started
        <span>↗</span>
      </a>
    </nav>
  );
}

export default Navbar;