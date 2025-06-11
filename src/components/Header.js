import React, { useState } from "react";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="logo">MyApp</div>

      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <a href="/" onClick={() => setMenuOpen(false)}>
          Home
        </a>
        <a href="#features" onClick={() => setMenuOpen(false)}>
          Features
        </a>
        <a href="#about" onClick={() => setMenuOpen(false)}>
          About
        </a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>
          Contact
        </a>
      </nav>
    </header>
  );
};

export default Header;
