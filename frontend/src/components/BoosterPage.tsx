// src/components/BoosterPage.tsx
import React, { useState } from 'react';
import Card from './Card';
import { generateRandomCards } from '../data/pokemonData';

interface BoosterPageProps {
  boostersOwned: number; // Track boosters owned
  setBoostersOwned: React.Dispatch<React.SetStateAction<number>>; // To update boosters owned
}

const BoosterPage: React.FC<BoosterPageProps> = ({ boostersOwned, setBoostersOwned }) => {
  const [clicks, setClicks] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [cardsRevealed, setCardsRevealed] = useState(false);
  const [cards, setCards] = useState(generateRandomCards());

  const handleBoosterClick = () => {
    if (cardsRevealed || boostersOwned <= 0) return; // Ne pas ouvrir si pas de boosters

    setIsShaking(true);
    setClicks((prevClicks) => prevClicks + 1);

    setTimeout(() => {
      setIsShaking(false);
    }, 500);

    if (clicks + 1 >= 3) {
      setCardsRevealed(true);
      setBoostersOwned((prev) => prev - 1); // Réduit le nombre de boosters après ouverture
      for (let i = 0; i < cards.length; i++) {
        cards[i].owned = true; // Tous les cartes sont considérées comme possédées après ouverture
      }
      setClicks(0);
    }
  };

  return (
    <div className="Booster_page">
      {!cardsRevealed ? (
        <div className="booster">
          <div className={`booster-image ${isShaking ? 'shake' : ''}`} onClick={handleBoosterClick}>
            <img src={'images/booster.png'} alt="Pokemon Booster"/>
          </div>
          <p> Boosters Owned: {boostersOwned}</p> {/* Display the number of boosters owned */}
        </div>
      ) : (
        <div className="booster-cards">
          {cards.map((card) => (
            <Card key={card.id} card={card} owned={true} allowFlip={true} /> // All cards are considered owned after opening
          ))}
        </div>
      )}
      {cardsRevealed && ( // Show button only when cards are revealed
        <button onClick={() => setCardsRevealed(false)} style={{ marginTop: '20px' }}> {/* Reset back to booster opening */}
          <span className="text">Click to open another booster!</span>
          <span className="shimmer"></span>
        </button>
      )}
    </div>
  );
};

export default BoosterPage;
