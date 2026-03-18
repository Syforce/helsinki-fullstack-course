const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const User = require('./models/user');
const DataLoader = require('dataloader');
const Book = require('./models/book');
const { bookCountLoader } = require('./loaders');

const JWT_SECRET = process.env.JWT_SECRET;

const MONGODB_URI = 'mongodb://localhost/library'; // replace with your URI

console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => console.log('connected to MongoDB'))
    .catch((error) => console.log('error connection to MongoDB:', error.message));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        let currentUser = null;
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const token = auth.substring(7);
            try {
                const decodedToken = jwt.verify(token, JWT_SECRET);
                currentUser = await User.findById(decodedToken.id);
            } catch (error) {
                console.log(error);
            }
        }

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

        return { currentUser, bookCountLoader };
    },
});

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
