import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      name
      born
    }
    genres
    id
  }
`

export const ALL_AUTHORS = gql`
    query AllAuthors {
    allAuthors {
        name
        id
        born
        bookCount
    }
}
`

export const ALL_BOOKS = gql`
    query AllBooks {
        allBooks {
          title
          published
          author {
            name
            born
          }
          genres
          id
        }
    }
`
export const NEW_BOOK = gql`
    mutation Mutation($title: String!, $published: Int!, $name: String!, $genres: [String]!) {
    addBook(title: $title, published: $published, name: $name, genres: $genres) {
      title
      published
      author {
        name
        born
      }
      genres
      id
    }
  }
`

export const AUTHOR_BORN = gql`
    mutation EditAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      id
      born
      bookCount
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const USER = gql`
  query Me {
    me {
      username
      favoriteGenre
      id
    }
  }
`

export const GENRE = gql`
  query AllBooks($genres: String) {
    allBooks(genres: $genres) {
      title
      published
      author {
        name
        born
      }
      genres
      id
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
//  
