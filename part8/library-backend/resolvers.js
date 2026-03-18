const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError } = require('apollo-server');
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');
const { PubSub } = require('graphql-subscriptions');
const DataLoader = require('dataloader');

const JWT_SECRET = process.env.JWT_SECRET;
const pubsub = new PubSub();

const bookCountLoader = new DataLoader(async (authorIds) => {
    const counts = await Book.aggregate([
        { $match: { author: { $in: authorIds } } },
        { $group: { _id: '$author', count: { $sum: 1 } } }
    ]);
    return authorIds.map(id => {
        const found = counts.find(c => c._id.equals(id));
        return found ? found.count : 0;
    });
});

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
            const bookCounts = await Book.aggregate([
                { $group: { _id: '$author', count: { $sum: 1 } } }
            ]);
            const countMap = bookCounts.reduce((map, item) => {
                map[item._id.toString()] = item.count;
                return map;
            }, {});
            return authors.map(author => ({
                ...author.toObject(),
                bookCount: countMap[author._id.toString()] || 0
            }));
        },
        me: (root, args, context) => {
            return context.currentUser;
        }
    },
    Author: {
        bookCount: async (root, args, context) => {
            return context.bookCountLoader.load(root._id);
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
                await pubsub.publish('BOOK_ADDED', {bookAdded: book.populate('author')});
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
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        }
    },
};

module.exports = resolvers;
