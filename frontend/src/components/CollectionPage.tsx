// src/components/CollectionPage.tsx
import React from 'react';
import { PokemonCard, pokemonData } from '../data/pokemonData';
import Card from './Card';

interface CollectionPageProps {
}

const CollectionPage: React.FC<CollectionPageProps> = () => {
  //const pokemonData = usePokemonData();


  return (
    <div className="collection-page">
      <h1>Your Collection</h1>
      <div className="cards-collections">
        {pokemonData.sort((a: PokemonCard, b: PokemonCard) => a.id - b.id).map((card: PokemonCard) => (
          <Card key={card.id} card={card} owned={card.owned} allowFlip={false}/>
        ))}
      </div>
    </div>
  );


  /*return (
    <div className="collection-page">
      <h1>Your Collection</h1>
      <div className="cards-collections">
        {pokemonData.map((card) => (
          <Card key={card.id} card={card} owned={card.owned} allowFlip={false} />
        ))}
      </div>
    </div>
  );*/
};

export default CollectionPage;
