import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommended from './components/Recommended'
import LoginForm from './components/LoginForm'
import { useQuery, useMutation, useSubscription, useApolloClient } from '@apollo/client';
import { ALL_BOOKS, BOOK_ADDED, ALL_AUTHORS } from './components/queries'


export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    console.log(allBooks)
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}


const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()
  const [page, setPage] = useState('authors')

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  useEffect( () => {
    const token = localStorage.getItem('user')
    setToken(token)
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (!token) {
    console.log(token)
    return(
      <>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommended')}>recommended</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommended show={page === 'recommended'} />
    </div>
  )
}

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

export default App
