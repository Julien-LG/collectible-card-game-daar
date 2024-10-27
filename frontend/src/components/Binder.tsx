// src/components/Binder.tsx
import React, { useEffect, useState } from 'react';
import { Card as CardInterface } from '../interfaces/card';
import { getCardsFromIds } from '../services/cardService';
import Card from './Card';
import { Rarity } from '../enums/rarity';

interface BinderProps {
  wallet : any;
  ownedCards: string[];
  setOwnedCards: React.Dispatch<React.SetStateAction<string[]>>;
}

const Binder: React.FC<BinderProps> = ({ wallet, ownedCards, setOwnedCards }) => {
  const [pokemonData, setPokemonData] = useState<CardInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    if (wallet) {
      fetchOwnedCardIds();
    }
  }, [wallet]);

  // Fetch the card data from the IDs retrieved
  useEffect(() => {
    if (ownedCards.length > 0) {
      fetchOwnedCardsData();
    }
  }, [ownedCards]);

  // Fetch IDs of all cards owned by the user from the wallet
  const fetchOwnedCardIds = async () => {
    const userAddress: string = wallet?.details?.account || '';
    if (userAddress === '') return;

    try {
      const cardsIds: string[] = await wallet.contract.getAllUserCards(userAddress);
      console.log('Owned Card IDs:', cardsIds);
      setOwnedCards(cardsIds);
    } catch (error) {
      console.error('Failed to fetch owned card IDs:', error);
    }
  };

  // Fetch card details based on owned card IDs
  const fetchOwnedCardsData = async () => {
    try {
      setLoading(true);
      const data = await getCardsFromIds(ownedCards);
      setPokemonData(data);
    } catch (error: any) {
      console.error("Failed to fetch card data:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // Function to sort cards by the specified criterion
  const sortCards = (criterion: 'number' | 'id' | 'rarity' | 'type' | 'name') => {
    const sortedData = [...pokemonData];

    switch (criterion) {
      case 'id':
        sortedData.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case 'number':
        sortedData.sort((a, b) => parseInt(a.number) - parseInt(b.number));
      break;
      case 'rarity':
        sortedData.sort((a, b) => {
          const rarityOrder = Object.values(Rarity);
          return (
            rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
          );
        });
        break;
      case 'type':
        sortedData.sort((a, b) => (a.types?.[0] || '').localeCompare(b.types?.[0] || ''));
        break;
      case 'name':
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setPokemonData(sortedData);
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Binder">
      <h1>Your Binder</h1>

      <div className="Binder-cards">
        {pokemonData.map((card: CardInterface) => (
          <Card key={card.id} card={card} owned={ownedCards.includes(card.id)} allowFlip={false} />
        ))}
      </div>
        <div className="sorting-buttons">
          <button onClick={() => sortCards('id')}>
              <span className="text">Sort by ID</span>
              <span className="shimmer"></span>
          </button>
          <button onClick={() => sortCards('number')}>
            <span className="text">Sort by Number</span>
            <span className="shimmer"></span>
          </button>
          <button onClick={() => sortCards('rarity')}>
            <span className="text">Sort by Rarity</span>
            <span className="shimmer"></span>
          </button>
          <button onClick={() => sortCards('type')}>
            <span className="text">Sort by Type</span>
            <span className="shimmer"></span>
          </button>
          <button onClick={() => sortCards('name')}>
            <span className="text">Sort by Name</span>
            <span className="shimmer"></span>
          </button>
      </div>
    </div>
  );
};

export default Binder;
