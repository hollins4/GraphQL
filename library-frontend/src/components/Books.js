import { useQuery } from '@apollo/client'
import { ALL_BOOKS, GENRE } from './queries'
import React, { useState } from 'react'


const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [ genre, setGenre ] = useState('')
  const books = []
  const booksByGenre = []

  let genreResult = useQuery(GENRE, { variables: { genres: genre } })


  if (!props.show) {
    return null
  }

  if (genreResult.loading || result.loading) {
    return <p>...loading</p>
  }

  books.push(...result.data.allBooks)
  booksByGenre.push(...genreResult.data.allBooks)

  //console.log(genreResult.data)
  //console.log(booksByGenre)

  let genres = []
  books.forEach(book => {
    book.genres.forEach(g => {
      !genres.includes(g) && genres.push(g)     
    })
  })
  genres.push("all genres")


  let booksToShow = !genre || genre === 'all genres' ? books : booksByGenre
  
  return (
    <div>
      <h2>Books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
        {genres.map((g, i) => (
          <input type="button" value={g} key={i} onClick={() => setGenre(g)} />
        ))}
    </div>
  )
}

export default Books
