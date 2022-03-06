const { gql } = require('apollo-server')

const typeDefs = gql`
    type Author {
        name: String!
        id: ID
        born: Int
        bookCount: Int
    }

    type Book {
        title: String!
        published: Int!
        author: Author!
        genres: [String!]!
        id: ID!
    }

    type User {
      username: String!
      favoriteGenre: String!
      id: ID!
    }
    
    type Token {
      value: String!
    }

    type Subscription {
        bookAdded: Book!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(name: String, genres: String): [Book!]!
        allAuthors: [Author!]!
        me: User 
    }

    type Mutation {
        addBook(
            title: String!
            published: Int!
            name: String!
            genres: [String]!
        ): Book
        editAuthor(
            name: String!
            born: Int!
        ): Author
        createUser(
          username: String!
          favoriteGenre: String!
        ): User
        login(
          username: String!
          password: String!
        ): Token
    }
`
module.exports = typeDefs