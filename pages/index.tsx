import { FC, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from 'lib/store'

const Home: FC = () => {
  return (
    <main>
      <Title />
      <Form />
      <Transactions />
      <Blocks />
    </main>
  )
}

const Title: FC = observer(() => {
  const store = useStore()

  return (
    <h1 className="title">
      {store.numberBlocks} Blocks ({store.valid ? 'Valid' : 'Invalid'})
    </h1>
  )
})

const Form: FC = () => {
  const store = useStore()
  const [message, setMessage] = useState('')

  const onSubmitHandler = (e) => {
    e.preventDefault()

    store.addTransaction(message)
    setMessage('')
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="message.."
        required
        className="message-input"
      />
      <button type="submit" className="btn">
        Add Message
      </button>
    </form>
  )
}

const Transactions: FC = observer(() => {
  const store = useStore()

  return store.transactions.length > 0 ? (
    <div>
      <h2>Pending Transactions</h2>
      <ul>
        {store.transactions.map((transaction, index) => (
          <li key={index} className="list-item">
            {transaction}
          </li>
        ))}
      </ul>
    </div>
  ) : null
})

const Blocks: FC = observer(() => {
  const store = useStore()

  return (
    <div className="block-container">
      <h2>Blocks</h2>
      {/* to show in reverse order. Take a copy : [...store.blocks].reverse().map() */}
      <ul>
        {store.blocks.map((block) => (
          <li key={block.hash} className="block-item">
            <h3>{block.hash}</h3>
            <pre>{JSON.stringify(block.transactions, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  )
})

export default Home
