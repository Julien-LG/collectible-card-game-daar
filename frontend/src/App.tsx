import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles.module.css'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'

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

export const App = () => {
  const wallet = useWallet()
  let balance = 0

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

  const addACardPkmn = (pokemonNumber: number) => {
    const userAddress: string = wallet?.details?.account || ''
    if (userAddress === '') return
    wallet?.contract.addACard(pokemonNumber).then((owner: number) => {
      console.log('Card added : ', owner)
    })
  }

  const getBalance = () => {
    const userAddress: string = wallet?.details?.account || ''
    if (userAddress === '') return
    const balance2 = 0
    wallet?.contract.balanceOf(userAddress).then((balance2: number) => {
      balance = balance2
      console.log('Balance of : ', balance2)
    })
  }

  return (
    <div className={styles.body}>
      <h1>Welcome to Pokémon TCG</h1>
      <p>wallet : {wallet?.details?.account}</p>

      <button onClick={() => addACardPkmn(56079)}>Add Card</button>
      <p>Balance of : {balance}</p>
      <button onClick={() => getBalance()}>Refresh Balance</button>
    </div>
  )
}
