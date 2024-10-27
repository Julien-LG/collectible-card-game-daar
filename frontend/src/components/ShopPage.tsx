// src/components/ShopPage.tsx
import React from 'react';
import { useEffect } from 'react';

interface ShopPageProps {
  wallet : any; 
  boostersOwned: number; // Prop to receive the number of boosters owned
  setBoostersOwned: React.Dispatch<React.SetStateAction<number>>;
}

const ShopPage: React.FC<ShopPageProps> = ({ wallet, boostersOwned, setBoostersOwned }) => {
  useEffect(() => {
    if (wallet) {
      nbBooster()
    }
  }, [wallet]) // Re-appelle si le wallet change

  const nbBooster = () => {
    const userAddress: string = wallet?.details?.account || ''
    if (userAddress === '') return
    wallet?.contract.getUserBoosterCount(userAddress).then((res: any) => {
      setBoostersOwned(res)
    })
  }

  const buyBooster = () => {
    const userAddress: string = wallet?.details?.account || ''
    if (userAddress === '') return

    wallet?.contract.buyABooster(userAddress, { value: 20000000 }) //value: 20 * Math.pow(10, 18)
    setBoostersOwned((prev) => prev + 1); // Increment the number of boosters owned
  }

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
