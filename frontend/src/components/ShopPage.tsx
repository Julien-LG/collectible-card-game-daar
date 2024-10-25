// src/components/ShopPage.tsx
import React from 'react';

interface ShopPageProps {
  boostersOwned: number; // Prop to receive the number of boosters owned
  setBoostersOwned: React.Dispatch<React.SetStateAction<number>>;
}

const ShopPage: React.FC<ShopPageProps> = ({ boostersOwned, setBoostersOwned }) => {
  const buyBooster = () => {
    setBoostersOwned((prev) => prev + 1); // Increment the number of boosters owned
  };

  return (
    <div className="shop-page">
      <h1>Shop</h1>
      <div>
        <img src={'images/booster.png'} alt="Buy Booster" />
        <p>Boosters Owned: {boostersOwned}</p> {/* Display the number of boosters owned */}
        <button onClick={buyBooster}>
          <span className="text">Buy Booster</span>
          <span className="shimmer"></span>
        </button>
      </div>
    </div>
  );
};

export default ShopPage;
