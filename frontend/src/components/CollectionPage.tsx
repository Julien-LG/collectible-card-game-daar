// src/components/CollectionPage.tsx
import React, { useEffect, useState } from 'react';
import { Card as CardInterface } from '../interfaces/card';
import { getCardsFromFirstSet, findCardsByQueries} from '../services/cardService';
import Card from './Card';
import { Rarity } from '../enums/rarity';

interface CollectionPageProps {
  wallet : any;
  ownedCards: string[];
  setOwnedCards: React.Dispatch<React.SetStateAction<string[]>>;
}

const CollectionPage: React.FC<CollectionPageProps> = ({ wallet, ownedCards, setOwnedCards }) => {
  const [pokemonData, setPokemonData] = useState<CardInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for the search term


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

  // Fonctions pour la recherche
  const onSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = event.target.value;
    setSearchTerm(newTerm);

    // Search for cards based on the input term
    if (newTerm) {
      const filteredCards = await findCardsByQueries({ q: `name:${newTerm}` });
      setPokemonData(filteredCards);
    } else {
      const allCards = await getCardsFromFirstSet();
      setPokemonData(allCards);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="collection-page">
      <h1>Your Collection</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search cards by name..."
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>

      <div className="cards-collections">
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

export default CollectionPage;
