// src/components/CollectionPage.tsx
import React, { useEffect, useState } from 'react';
import { Card as CardInterface } from '../interfaces/card';
import { getCardsFromFirstSet } from '../services/cardService';
import Card from './Card';

interface CollectionPageProps {
  wallet : any;
  ownedCards: string[];
  setOwnedCards: React.Dispatch<React.SetStateAction<string[]>>;
}

const CollectionPage: React.FC<CollectionPageProps> = ({ wallet, ownedCards, setOwnedCards }) => {
  const [pokemonData, setPokemonData] = useState<CardInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (wallet) {
      getAllCardsIds()
    }
  }, [wallet]) // Re-appelle si le wallet change

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

  const getAllCardsIds = () => {
    const userAddress: string = wallet?.details?.account || ''
    if (userAddress === '') return

    wallet?.contract.getAllUserCards(userAddress).then((cardsIds: string[]) => {
      console.log('Cards owned:', cardsIds);
      setOwnedCards(cardsIds)
    });
  }

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
