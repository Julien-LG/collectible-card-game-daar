import React, { useState, useEffect } from 'react';
//import axios from 'axios';

// Export the PokemonCard interface
export interface PokemonCard {
    id: number;
    name: string;
    image: string;
    backImage: string;
    owned: boolean;
}
  
  // Example card data
export const pokemonData: PokemonCard[] = [ // Make sure this is exported as pokemonData
    { id: 1, name: 'Pikachu', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', 
        /*backImage: 'https://cdn2.bulbagarden.net/upload/1/17/Cardback.jpg',  owned: false},*/
        backImage: 'images/back_of_card.jpg', owned: false},
    { id: 2, name: 'Bulbasaur', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', 
        backImage: 'images/back_of_card.jpg', owned: false},
    { id: 3, name: 'Charmander', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', 
        backImage: 'images/back_of_card.jpg', owned: false},
    { id: 4, name: 'Squirtle', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', 
        backImage: 'images/back_of_card.jpg', owned: false},
    { id: 5, name: 'Jigglypuff', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png', 
        backImage: 'images/back_of_card.jpg', owned: false },
    { id: 6, name: 'Meowth', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png', 
        backImage: 'images/back_of_card.jpg', owned: false},
    { id: 7, name: 'Psyduck', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png', 
        backImage: 'images/back_of_card.jpg', owned: false },
    { id: 8, name: 'Snorlax', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png', 
        backImage: 'images/back_of_card.jpg', owned: false },
    { id: 9, name: 'Magikarp', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png', 
        backImage: 'images/back_of_card.jpg', owned: false },
    { id: 10, name: 'Eevee', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png', 
        backImage: 'images/back_of_card.jpg', owned: false },
    { id: 11, name: 'Mewtwo', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', 
        backImage: 'images/back_of_card.jpg', owned: false },
    { id: 12, name: 'Dragonite', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png', 
        backImage: 'images/back_of_card.jpg', owned: false },
    // Add more cards as needed
];
  
// Function to generate random cards
export const generateRandomCards = (): PokemonCard[] => {
    const shuffled = pokemonData.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10); // Return 5 random cards
};

// Fetch card data from the local server or Pokémon TCG API
/*
export const usePokemonData = () => {
    const [pokemonData, setPokemonData] = useState<PokemonCard[]>([]);

    useEffect(() => {
    const fetchData = async () => {
        try {
        // Fetch the card data
        const res = await axios.get('http://localhost:3003/images/list');
        setPokemonData(res.data.files.map((file: string) => ({
            id: file,
            name: file.split('.')[0], // Extract name from filename
            image: `http://localhost:3003/images/${file}`,
            backImage: `http://localhost:3003/images/cardback.jpg`, // Generic back image
            owned: false,
        })));
        } catch (error) {
        console.error('Error fetching Pokémon cards:', error);
        }
    };

    fetchData();
    }, []);

    return pokemonData;
};

const fetchPokemonCardData = async () => {
    try {
    const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
        headers: {
        'X-Api-Key': '1d84c1e5-29e3-4712-8ffd-891feb21094e',  // Replace with your actual API key
        },
    });
    return response.data.data; // Cards data
    } catch (error) {
    console.error('Error fetching card data:', error);
    return [];
    }
};
*/
  