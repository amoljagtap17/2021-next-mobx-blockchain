import sha256 from 'crypto-js/sha256'
import { createContext, useContext, useEffect, FC } from 'react'
import { makeAutoObservable } from 'mobx'

interface IBlock {
  hash: string
  transactions: Array<string>
}

class BlockchainStore {
  blocks: Array<IBlock> = []
  transactions: Array<string> = []

  constructor() {
    makeAutoObservable(this)
  }

  // derivation of state. Computed property in mobx
  get numberBlocks() {
    return this.blocks.length
  }

  get valid() {
    return this.blocks.every((block, index) => {
      const prevBlock = this.blocks[index - 1] ?? { hash: '' }
      const hash = sha256(
        `${prevBlock.hash}${JSON.stringify(block.transactions)}`
      ).toString()

      return hash === block.hash
    })
  }

  // mobx handles immutability behind the scene
  addTransaction(message: string) {
    this.transactions.push(message)
  }

  writeBlock() {
    if (this.transactions.length === 0) {
      return
    }

    //make a copy
    const transactions = [...this.transactions]
    this.transactions = []

    // nullish coallesce operator ??
    // if previous block is not there. In case of first block
    const prevBlock = this.blocks[this.blocks.length - 1] ?? { hash: '' }
    const hash = sha256(
      `${prevBlock.hash}${JSON.stringify(transactions)}`
    ).toString()

    // write to block. It consists of hash and transactions
    this.blocks.push({
      hash,
      transactions,
    })
  }
}

const StoreContext = createContext<BlockchainStore>(new BlockchainStore())

const StoreProvider: FC<{ store: BlockchainStore }> = ({ store, children }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      store.writeBlock()
    }, 5000)

    return () => clearInterval(interval)
  }, [store])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

const useStore = () => {
  return useContext(StoreContext)
}

export { BlockchainStore, StoreProvider, useStore }
