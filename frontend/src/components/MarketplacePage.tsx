// src/components/MarketplacePage.tsx
import React, { useEffect, useState } from 'react';
import { Card as CardInterface } from '../interfaces/card';
import { findCardsByQueries } from '../services/cardService'; // Ensure to import your service functions
import Card from './Card';

interface MarketplacePageProps {
  wallet: any;
  ownedCards: string[];
  setOwnedCards: React.Dispatch<React.SetStateAction<string[]>>;
}

const MarketplacePage: React.FC<MarketplacePageProps> = ({ wallet, ownedCards, setOwnedCards }) => {
  const [pokemonData, setPokemonData] = useState<CardInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for the search term

  /*
  useEffect(() => {
    if (wallet) {
      getAllCardsInSale();
    }
  }, [wallet]); // Re-fetch when the wallet changes

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await getAllCardsInSale(); // Fetch cards available for sale
        setPokemonData(data);
      } catch (error: any) {
        console.error("Failed to fetch cards:", error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const getAllCardsInSale = () => {
    const userAddress: string = wallet?.details?.account || '';
    if (userAddress === '') return;

    wallet?.contract.getAllUserCards(userAddress).then((cardsIds: string[]) => {
      console.log('Cards owned:', cardsIds);
      setOwnedCards(cardsIds);
    });
  };

  // Function to sort cards by the specified criterion
  const sortCards = (criterion: 'id' | 'price' | 'owner' | 'name') => {
    const sortedData = [...pokemonData];

    switch (criterion) {
      case 'id':
        sortedData.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case 'price':
        //sortedData.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'owner':
        //sortedData.sort((a, b) => (a.owner || '').localeCompare(b.owner || ''));
        break;
      case 'name':
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setPokemonData(sortedData);
  };

  // Function to handle search
  const onSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = event.target.value;
    setSearchTerm(newTerm);

    // Search for cards based on the input term
    if (newTerm) {
      const filteredCards = await findCardsByQueries({ q: `name:${newTerm}` }); // Modify based on how your search works
      setPokemonData(filteredCards);
    } else {
      const allCards = await getAllCardsInSale(); // Fetch all cards for sale again
      setPokemonData(allCards);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="marketplace-page">
      <h1>Marketplace</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search cards by name..."
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>

      <div className="sorting-buttons">
        <button onClick={() => sortCards('id')}>
          <span className="text">Sort by ID</span>
          <span className="shimmer"></span>
        </button>
        <button onClick={() => sortCards('price')}>
          <span className="text">Sort by Price</span>
          <span className="shimmer"></span>
        </button>
        <button onClick={() => sortCards('owner')}>
          <span className="text">Sort by Owner</span>
          <span className="shimmer"></span>
        </button>
        <button onClick={() => sortCards('name')}>
          <span className="text">Sort by Name</span>
          <span className="shimmer"></span>
        </button>
      </div>

      <div className="cards-collections">
        {pokemonData.map((card: CardInterface) => (
          <Card 
            key={card.id} 
            card={card} 
            owned={ownedCards.includes(card.id)} 
            allowFlip={false} 
          />
        ))}
      </div>
    </div>
  );
  */
  return <div>Marketplace Page is in progress</div>;
};

export default MarketplacePage;
