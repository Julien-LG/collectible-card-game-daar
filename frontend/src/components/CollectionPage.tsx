// src/components/CollectionPage.tsx
import React, { useEffect, useState } from 'react';
import { Card as CardInterface } from '../interfaces/card';
import { getCardsFromFirstSet } from '../services/cardService';
import Card from './Card';

interface CollectionPageProps {
  wallet : any;
  ownedCards: string[];
}

const CollectionPage: React.FC<CollectionPageProps> = ({ wallet, ownedCards }) => {
  const [pokemonData, setPokemonData] = useState<CardInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchCards = async () => {
        try {
            const data = await getCardsFromFirstSet();
            setPokemonData(data);
        } catch (error : any) {
            console.error("Failed to fetch cards:", error.message || error);
        } finally {
            setLoading(false); 
        }
    };

    fetchCards();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="collection-page">
      <h1>Your Collection</h1>
      <div className="cards-collections">
        {pokemonData.map((card: CardInterface) => (
          <Card key={card.id} card={card} owned={ownedCards.includes(card.id)} allowFlip={false} />
        ))}
      </div>
    </div>
  );
};

export default CollectionPage;
