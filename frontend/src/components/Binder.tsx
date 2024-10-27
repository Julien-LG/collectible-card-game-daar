// src/components/Binder.tsx
import '../binder.css';
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
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null);


  const CARDS_PER_PAGE = 25; 

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
  /*const sortCards = (criterion: 'number' | 'id' | 'rarity' | 'type' | 'name') => {
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
    */

  const maxPages = Math.ceil(pokemonData.length / CARDS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < maxPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const getPageData = () => {
    const start = currentPage * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;
    return pokemonData.slice(start, end);
  };


  const onDragStart = (index: number) => {
    setDraggedCardIndex(index);
  };

  // Handle drag over slot
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Prevent default to allow drop
  };

  // Handle drop into new slot
  const onDrop = (index: number) => {
    if (draggedCardIndex === null || draggedCardIndex === index) return;

    const updatedData = [...pokemonData];
    const draggedCard = updatedData[draggedCardIndex];
    updatedData[draggedCardIndex] = updatedData[index];
    updatedData[index] = draggedCard;

    setPokemonData(updatedData);
    setDraggedCardIndex(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Binder">
        <h1>Your Binder</h1>

        <div className="Binder-cards">
            {getPageData().map((card: CardInterface | null, index) => (
            <div
                className="card-slot"
                key={index}
                onDragOver={onDragOver}
                onDrop={() => onDrop(index)}
            >
                {card ? (
                    <div
                        draggable
                        onDragStart={() => onDragStart(index)}
                    >
                        <Card card={card} owned={ownedCards.includes(card.id)} allowFlip={false} inBinder />
                    </div>
                ) : (
                    <div className="empty-slot">Empty Slot</div>
                )}
            </div>
            ))}
            {Array.from({ length: CARDS_PER_PAGE - getPageData().length }).map((_, index) => (
            <div className="card-slot empty-slot" key={`empty-${index}`}>
                Empty Slot
            </div>
            ))}
        </div>

        <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 0}>
                Previous Page
            </button>
                <span>
                    Page {currentPage + 1} of {maxPages}
                </span>
            <button onClick={handleNextPage} disabled={currentPage === maxPages - 1}>
                Next Page
            </button>
        </div>
        {/*
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
        */}
    </div>
  );
};

export default Binder;
