import React from 'react';

const BurgerMenu: React.FC<{ toggleMenu: () => void }> = ({ toggleMenu }) => {
  return (
    <div>
      <button onClick={toggleMenu}>Close</button>
      <a href="/">Home</a>
      <a href="/about">About Us</a>
      <a href="/contact">Contact</a>
    </div>
  );
}

export default BurgerMenu;
