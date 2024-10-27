import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import * as ethereum from '@/lib/ethereum';
import * as main from '@/lib/main';
import { ethers } from 'ethers';

//Notre code pour le front-end
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import BoosterPage from './components/BoosterPage';
import CollectionPage from './components/CollectionPage';
import ShopPage from './components/ShopPage';
import MarketplacePage from './components/MarketplacePage';
import AdminPage from './components/AdminPage';

type Canceler = () => void
const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>()
  useEffect(() => {
    asyncEffect()
      .then(canceler => (cancelerRef.current = canceler))
      .catch(error => console.warn('Uncatched error', error))
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current()
        cancelerRef.current = undefined
      }
    }
  }, dependencies)
}

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>()
  const [contract, setContract] = useState<main.Main>()
  useAffect(async () => {
    const details_ = await ethereum.connect('metamask')
    if (!details_) return
    setDetails(details_)
    const contract_ = await main.init(details_)
    if (!contract_) return
    setContract(contract_)
  }, [])
  return useMemo(() => {
    if (!details || !contract) return
    return { details, contract }
  }, [details, contract])
}

export async function loadOwnerNbCard(wallet: any) {
  return await wallet?.contract.totalBalance()
}

export const App: React.FC = () => {
  const wallet = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [cardImg, setCardImg] = useState<string>('')
  const [ownerCard, setOwnerCard] = useState<string>('idk')
  const [adminAdr, setAdminAdr] = useState<string>('idk')
  // let balance = -1

  const [boostersOwned, setBoostersOwned] = useState(0); // Track owned boosters
  const [ownedCards, setOwnedCards] = useState<string[]>([]); // State for owned card IDs

  const addOwnedCard = (id: string) => {
    // Ajoute une carte à la collection si elle n'est pas déjà présente
    if (!ownedCards.includes(id)) {
      setOwnedCards((prev) => [...prev, id]);
    }
  };

  const addACardPkmn = () => {
    const userAddress: string = wallet?.details?.account || ''
    if (userAddress === '') return
    wallet?.contract.mint(userAddress, 0)
  }

  const transferCard = () => {
    const userAddress: string = wallet?.details?.account || ''
    if (userAddress === '') return
    wallet?.contract.transferCard(0, userAddress)
  }

  const getOwner = () => {
    wallet?.contract.getAdmin().then((ownerAdress: string) => {
      setAdminAdr(ownerAdress)
      console.log('Admin adress : ', ownerAdress)
    })
  }

  const isAdmin = () => {
    return wallet?.details?.account === adminAdr
  }
  
  useEffect(() => {
    if (wallet) {
      getOwner()
    }
  }, [wallet]) // Re-appelle si le wallet change

  /**/
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            <li>
              <Link to="/">Booster</Link>
            </li>
            <li>
              <Link to="/collection">Collection</Link>
            </li>
            <li>
              <Link to="/marketplace">Marketplace</Link>
            </li>
            {isAdmin() && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<BoosterPage wallet={wallet} boostersOwned={boostersOwned} setBoostersOwned={setBoostersOwned} addOwnedCard={addOwnedCard}/>} />
          <Route path="/collection" element={<CollectionPage wallet={wallet} ownedCards={ownedCards} setOwnedCards={setOwnedCards}/>} />
          <Route path="/shop" element={<ShopPage wallet={wallet} boostersOwned={boostersOwned} setBoostersOwned={setBoostersOwned} />} />
          <Route path="/marketplace" element={<MarketplacePage wallet={wallet} ownedCards={ownedCards} setOwnedCards={setOwnedCards} />} />
          {isAdmin() && (
            <Route path="/admin" element={<AdminPage wallet={wallet}/>} />
          )}
        </Routes>
      </div>
    </Router>
  );
}
