// Importing the Set interface and necessary services
import React, { useEffect, useState } from 'react';
import { Set as SetInterface } from '../interfaces/set';
import { Card as CardInterface } from '../interfaces/card';
import { getAllCards } from '../services/cardService';
import { findSetByID } from '../services/setService';
import Card from './Card';

interface SetProps {
  setId: string; // ID of the set to fetch
}

const Set: React.FC<SetProps> = ({ setId }) => {
  // State for set data, cards, and loading
  const [setData, setSetData] = useState<SetInterface | null>(null);
  const [cards, setCards] = useState<CardInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch set details and associated cards on component mount
  useEffect(() => {
    const fetchSetData = async () => {
      try {
        // Fetch set data based on the set ID
        const setInfo = await findSetByID(setId); // Use setService's findSetByID
        setSetData(setInfo);

        // Fetch all cards for this set by adding filter in getAllCards call
        const cardData = await getAllCards({ pageSize: 250, q: `set.id:${setId}` });
        setCards(cardData);
      } catch (error) {
        console.error('Error fetching set or cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSetData();
  }, [setId]);

  // Display a loading message until data is ready
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="set-page">
      <h1>{setData ? setData.name : 'Set'} Collection</h1>
      <p>Series: {setData?.series}</p>
      <p>Release Date: {setData?.releaseDate}</p>
      <div className="cards-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} owned={false} allowFlip={true} />
        ))}
      </div>
    </div>
  );
};

export default Set;
