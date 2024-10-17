import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles.module.css'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'
import { ethers } from 'ethers'

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

export const App = () => {
  const wallet = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [cardImg, setCardImg] = useState<string>('')
  // let balance = -1

  const testCard = (cardNumber : number)  => {
    if (!wallet) return
    const { contract } = wallet
    contract.addACard(cardNumber).then(() => {
      console.log('Card added')
    })
    return true
  }

  // sans return
  // const addACardPkmn = (pokemonNumber: number) => {
  //   const userAddress: string = wallet?.details?.account || ''
  //   if (userAddress === '') return
  //   wallet?.contract.addACard(pokemonNumber)
  // }

  const getImageCardPkmn = (pokemonNumber : number) => {
    const userAddress: string = wallet?.details?.account || ''
    if (userAddress === '') return

    wallet?.contract.getCardImage(pokemonNumber).then((value: string) => {
      setCardImg(value)
      console.log("VALUE IMG : ", value);
    });
  }

  const addACardPkmn = () => {
      const userAddress: string = wallet?.details?.account || ''
      if (userAddress === '') return
      wallet?.contract.addACard()
    }

  const getOwnerBalance = () => {
    const userAddress: string = wallet?.details?.account || ''
    if (userAddress === '') return
    const balance2 = 89
    wallet?.contract.ownerNbCard().then((balance2: number) => {
      //balance = balance2
      console.log('Balance of : ', balance2)
    })
  }

  // fonctionne
  const getvalue = () => {
    loadOwnerNbCard(wallet).then((value) => {
      setBalance(value)
      console.log("VALUE : ", value);
    });
  }
  
  useEffect(() => {
    if (wallet) {
      getvalue()
    }
  }, [wallet]) // Re-appelle si le wallet change

  return (
    <div className={styles.body}>
      <h1>Welcome to Pokémon TCG</h1>
      <p>wallet : {wallet?.details?.account}</p>

      <button onClick={() => addACardPkmn()}>Add Card</button>
      <button onClick={() => getImageCardPkmn(0)}>get Card img 888</button>
      
      {/* <p>Balance of : {balance}</p> */}
      {/* Affiche la balance avec une vérification */}
      <p>Balance of : {balance !== null ? balance : 'Loading...'}</p>
      <button onClick={() => getOwnerBalance()}>Refresh Balance</button>
      <button onClick={() => getvalue()}>balance Balance</button>

      <img src={cardImg} /> 
    </div>
  )
}
