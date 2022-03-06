const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError } = require('apollo-server')
const Author = require('./models/authors')
const Book = require('./models/books')
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const resolvers = {
    Query: {
      authorCount: async () => Author.collection.countDocuments(),
      bookCount: async () => Book.collection.countDocuments(),
      allBooks: async (root, args) => {
  
          if (args.name && args.genres) {
            let books = await Book.find( { $and: [ { name: args.name }, { genres: args.genres } ] } ).populate('author', { name: 1, id: 1 })
            return books.filter(book => book.author.name === args.name && book.genres.includes(args.genres))
          } else if (args.name) {
              let books = await Book.find( { name: { $in: [args.name] } }).populate('author', { name: 1, id: 1 })
              return books.filter(book => book.author.name === args.name)
          } else if (args.genres) {
              let books = await Book.find({ genres: { $in: [args.genres] }}).populate('author', { name: 1, id: 1 })
              return books.filter(book => book.genres.includes(args.genres))
          }
  
          let books = await Book.find({}).populate('author', { name: 1, id: 1 })
          return books
      },
      allAuthors: async () => {
          
          let books = await Book.find({}).populate('author', { name: 1, id: 1 })
          let authors = await Author.find({ author: books[0].author}).populate('bookCount')
          
          
          authors.forEach(author => {
              let count = books.filter(book => {
                 return book.author.name === author.name
              }).length
              console.log("Author: ", author.name)
              author.bookCount = count
          })
          
          
          return authors
      },      
      me: (root, args, context) => {
          return context.currentUser
      },

    },

    Mutation: {
        addBook: async (root, args, context) => {
  
          console.log("Arg name: ", args.name)
          let author = await Author.findOne({ name: args.name })
  
          if (!context.currentUser)
            throw new AuthenticationError("User not authenticated")
          
          if (!author) {
            try {
              author = new Author({ name: args.name })
              author.save()
            } catch (error) {
              throw new UserInputError(error.message, {
                invalidArgs: args
              })
            }
          } 

          try {
            const book = await new Book({ title: args.title, published: args.published, genres: args.genres, author: author })
            book.save()

            pubsub.publish('BOOK_ADDED', { bookAdded: book })
            return book

          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args
            })
          }
          
        },
        editAuthor: async (root, args, context) => {
          if (!context.currentUser)
            throw new AuthenticationError("User not authenticated")
  
          let author = await Author.findOne({ name: args.name })
          if (!author)
              return null
          
          author.born = args.born
          return author.save()
        },
        createUser: async (root, args) => {
          const user = new User( { username: args.username, favoriteGenre: args.favoriteGenre })
  
          return user.save()
            .catch(error => {
              throw new UserInputError(error.message, {
                invalidArgs: args
              })
            })
        },
        login: async (root, args) => {
          const user = await User.findOne( { username: args.username })
          console.log(args.username)
          if (!user || args.password !== 'secret') {
            throw new UserInputError("wrong credentials")
          }
  
          const userForToken = {
            username: user.username,
            id: user._id
          }
  
          return { value: jwt.sign(userForToken, JWT_SECRET) }
        },  

    },
    Subscription: {
        bookAdded: {
          subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        },
      },
  }

  module.exports = resolvers

  /*
      Author: {
        
      bookCount: async (root) => {
        const books = await Book.find({
          author: {
            $in: [root._id]
          } 
        })
        console.log(root)
        console.log(books)
        return books.length
      }
    },

*/

  
