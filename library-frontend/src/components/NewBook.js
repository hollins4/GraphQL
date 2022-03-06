import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { NEW_BOOK, ALL_BOOKS, ALL_AUTHORS } from './queries'
import { updateCache } from '../App'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ newBook ] = useMutation(NEW_BOOK, {


    refetchQueries: [ { query: ALL_BOOKS}, {query: ALL_AUTHORS} ]

  })

  //    refetchQueries: [ { query: ALL_BOOKS}, {query: ALL_AUTHORS} ],

  /*
      update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook)
    }, 
  */

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    console.log(title, published, name, genres)

    newBook( {variables: {title, published, name, genres} })

    console.log('add book...')

    setTitle('')
    setPublished('')
    setName('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
