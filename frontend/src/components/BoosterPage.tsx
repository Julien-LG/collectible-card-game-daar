// src/components/BoosterPage.tsx
import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Card as CardInterface } from '../interfaces/card';
import { getCardsFromIds } from '../services/cardService';

interface BoosterPageProps {
  wallet: any;
  boostersOwned: number;
  setBoostersOwned: React.Dispatch<React.SetStateAction<number>>;
  addOwnedCard: (id: string) => void;
}

const BoosterPage: React.FC<BoosterPageProps> = ({ wallet, boostersOwned, setBoostersOwned,  addOwnedCard}) => {
  const [clicks, setClicks] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [cardsRevealed, setCardsRevealed] = useState(false);
  const [cards, setCards] = useState<CardInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleBoosterClick = async () => {
    const userAddress: string = wallet?.details?.account || ''
    if (userAddress === '') return
    if (cardsRevealed || boostersOwned <= 0 || isLoading) return; // Ne pas ouvrir si pas de boosters

    setIsShaking(true);
    setClicks((prevClicks) => prevClicks + 1);

    setTimeout(() => {
      setIsShaking(false);
    }, 500);

    if (clicks + 1 >= 3) {
      setIsLoading(true);

      // await wallet?.contract.openABooster(userAddress).then((values: string[]) => {
      //   console.log("VALUES IMG : ", values);
      // });
      const values = await wallet?.contract.openABooster(userAddress)
      const newCards = await getCardsFromIds(values);
      // essayer sans getCardsFormIDS, le faire à la main avec getCardFromId
      setCards(newCards);
      setCardsRevealed(true);
      setBoostersOwned((prev) => prev - 1);
      newCards.forEach(card => addOwnedCard(card.id)); // Use the prop function to add owned cards
      setIsLoading(false);
      setClicks(0);
    }
  };

  return (
    <div className="Booster_page">
      {isLoading ? (
        <div className="loading-screen">
          <p>Loading your cards...</p>
        </div>
      ) : !cardsRevealed ? (
        <div className="booster">
          <div className={`booster-image ${isShaking ? 'shake' : ''}`} onClick={handleBoosterClick}>
            <img src={'images/booster.png'} alt="Pokemon Booster"/>
          </div>
          <p> Boosters Owned: {boostersOwned}</p>
        </div>
      ) : (
        <div className="booster-cards">
          {cards.map((card) => (
            <Card key={card.id} card={card} owned={true} allowFlip={true} /> // All cards are considered owned after opening
          ))}
        </div>
      )}
      {cardsRevealed && ( 
        <button onClick={() => setCardsRevealed(false)} style={{ marginTop: '20px' }}>
          <span className="text">Click to open another booster!</span>
          <span className="shimmer"></span>
        </button>
      )}
    </div>
  );
};

export default BoosterPage;
