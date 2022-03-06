import { useQuery } from '@apollo/client';
import { ALL_BOOKS, USER } from './queries'
import React, { useState } from 'react'

const Recommended = (props) => {
    const result = useQuery(ALL_BOOKS)
    const userData = useQuery(USER)

    if (!props.show) {
        return null
    }

    const books = []

    if (result.loading) {
        return <p>...loading</p>
    }

    books.push(...result.data.allBooks)
    

    const user = userData.data.me.username
    const genre = userData.data.me.favoriteGenre

    console.log(genre)

    let booksToShow = books.filter(book => book.genres.includes(genre))

    return (
        <div>
            <h2>Recommended Books</h2>
            <br />
            <p>books for <b>{user}</b> as per favorite genre: <b>{genre}</b> </p>
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
        </div>
    )
}    

export default Recommended