const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError } = require('apollo-server');
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY';

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            let filter = {};
            if (args.author) {
                const author = await Author.findOne({ name: args.author });
                if (author) {
                    filter.author = author._id;
                } else {
                    return [];
                }
            }
            if (args.genre) {
                filter.genres = { $in: [args.genre] };
            }
            return Book.find(filter).populate('author');
        },
        allAuthors: async () => {
            const authors = await Author.find({});
            return authors;
        },
        me: (root, args, context) => {
            return context.currentUser;
        }
    },
    Author: {
        bookCount: async (root) => {
            return Book.countDocuments({ author: root._id });
        }
    },
    Mutation: {
        addBook: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated');
            }

            let author = await Author.findOne({ name: args.author });
            if (!author) {
                try {
                    author = new Author({ name: args.author });
                    await author.save();
                } catch (error) {
                    throw new UserInputError(error.message, {
                        invalidArgs: args,
                    });
                }
            }

            const book = new Book({ ...args, author: author._id });
            try {
                await book.save();
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                });
            }

            return book.populate('author');
        },
        editAuthor: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated');
            }

            const author = await Author.findOne({ name: args.name });
            if (!author) return null;

            author.born = args.setBornTo;
            try {
                await author.save();
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                });
            }
            return author;
        },
        createUser: async (root, args) => {
            const user = new User({
                username: args.username,
                favoriteGenre: args.favoriteGenre
            });
            try {
                await user.save();
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                });
            }
            return user;
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });
            if (!user || args.password !== 'secret') {
                throw new UserInputError('wrong credentials');
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            };

            return { value: jwt.sign(userForToken, JWT_SECRET) };
        }
    }
};

module.exports = resolvers;
