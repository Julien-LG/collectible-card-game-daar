// src/components/ShopPage.tsx
import React from 'react';

import { generateRandomCardsIds } from '../services/cardService';

interface AdminPageProps {
  wallet: any;
}

const AdminPage: React.FC<AdminPageProps> = ({ wallet}) => {
  // const buyBooster = () => {
  //   setBoostersOwned((prev) => prev + 1); // Increment the number of boosters owned
  // };
  const createBooster = async () => {
    const userAddress: string = wallet?.details?.account || ''
    if (userAddress === '') return

    const newCardsIds = await generateRandomCardsIds();

    wallet?.contract.mintBooster(newCardsIds)
  }

  return (
    <div className={"admin-page"}>
      <h1>Welcome to Pokémon TCG</h1>
      <p>wallet : {wallet?.details?.account}</p>

      {/* <button onClick={() => addACardPkmn()}>Add Card</button>
      <button onClick={() => getImageCardPkmn(0)}>get Card img 888</button> */}
      
      {/* { <p>Balance of : {balance}</p> }
      <p>Balance of : {balance !== null ? balance : 'Loading...'}</p>
      <button onClick={() => getOwnerBalance()}>Refresh Balance</button>
      <button onClick={() => getvalue()}>total Balance</button>
      <p>propery of : {ownerCard}</p>
      <button onClick={() => getOwner(0)}>Reload property</button>
      <p>admin adr is : {adminAdr}</p>
      <button onClick={() => transferCard()}>transfer card</button>
      <button onClick={() => getAllCardsLinks()}>get all cards links</button> */}
      <p>Tests pour les boosters</p>
      <button onClick={() => createBooster()}>create booster</button>
      {/* <button onClick={() => buyBooster()}>buy booster</button>
      <button onClick={() => openBooster()}>open booster</button> */}
    </div>
  );
};

export default AdminPage;
