import { Parameter } from '../interfaces/parameter';
import { Card } from '../interfaces/card';
import { Set } from '../interfaces/set';
import { Type } from '../enums/type';
import { Supertype } from '../enums/supertype';
import { Subtype } from '../enums/subtype';
import { Rarity } from '../enums/rarity';
import { Client } from '../client';

import { getAllSets } from './setService'; 

async function paginateAllCards(pageNumber: number, params?: Parameter): Promise<Card[]> {
    let currentPage = pageNumber;
    const client: Client = Client.getInstance();
    const response: Card[] = await client.get<Card[]>('cards', { pageSize: 250, page: currentPage, ...params });

    if (response.length === 0) {
        return response;
    } else {
        currentPage++;
        return response.concat(await paginateAllCards(currentPage));
    }
}

export async function getAllCards(params?: Parameter): Promise<Card[]> {
    const startingPage = 1;
    const response: Card[] = await paginateAllCards(startingPage, params);
    
    console.log('API Response:', response);
    
    return response;
}

export async function findCardByID(id: string): Promise<Card> {
    const client: Client = Client.getInstance();
    const response: Card = await client.get<Card>('cards', id);
    return response;
}

export async function findCardsByQueries(params: Parameter): Promise<Card[]> {
    const client: Client = Client.getInstance();
    const response: Card[] = await client.get<Card[]>('cards', params);
    return response;
}

export async function getTypes(): Promise<Type[]> {
    const client: Client = Client.getInstance();

    const response: Type[] = await client.get<Type[]>('types');
    return response;
}

export async function getSupertypes(): Promise<Supertype[]> {
    const client: Client = Client.getInstance();

    const response: Supertype[] = await client.get<Supertype[]>('supertypes');
    return response;
}

export async function getSubtypes(): Promise<Subtype[]> {
    const client: Client = Client.getInstance();

    const response: Subtype[] = await client.get<Subtype[]>('subtypes');
    return response;
}

export async function getRarities(): Promise<Rarity[]> {
    const client: Client = Client.getInstance();

    const response: Rarity[] = await client.get<Rarity[]>('rarities');
    return response;
}

// Corrected function to get all cards from the first set
export async function getCardsFromFirstSet(): Promise<Card[]> {
    const client: Client = Client.getInstance();
    
    // Fetch all sets using the getAllSets function
    const allSets: Set[] = await getAllSets();
    
    if (allSets.length === 0) {
        throw new Error("No sets found.");
    }
    
    // Get the ID of the first set
    const firstSetId = allSets[0].id;
    
    // Retrieve all cards from the first set by adding `set.id` query in `params`
    const params: Parameter = { pageSize: 250, q: `set.id:${firstSetId}` };
    const cardsFromFirstSet: Card[] = await client.get<Card[]>('cards', params);

    return cardsFromFirstSet;
}

// Modify the function to generate a specified number of random cards
// including at least one rare card from the first set
export async function generateRandomCards(count: number = 10): Promise<Card[]> {
    // Retrieve all cards from the first set
    const allCards = await getCardsFromFirstSet();

    // Separate cards into rare and non-rare categories
    const rareCards = allCards.filter(card => card.rarity === 'Rare');
    const nonRareCards = allCards.filter(card => card.rarity !== 'Rare');

    // If there are no rare cards in the set, handle the error
    if (rareCards.length === 0) {
        throw new Error("No rare cards found in the first set.");
    }

    // Shuffle and select one rare card
    const selectedRareCard = rareCards[Math.floor(Math.random() * rareCards.length)];

    // Shuffle non-rare cards and select the remaining needed cards
    const shuffledNonRares = nonRareCards.sort(() => Math.random() - 0.5);
    const selectedNonRares = shuffledNonRares.slice(0, count - 1);

    // Combine the selected rare card with the selected non-rare cards
    const selectedCards = [selectedRareCard, ...selectedNonRares];

    return selectedCards;
}