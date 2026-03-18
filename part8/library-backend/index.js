const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const User = require('./models/user');

const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message);
    });

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const token = auth.substring(7);
            try {
                const decodedToken = jwt.verify(token, JWT_SECRET);
                const currentUser = await User.findById(decodedToken.id);
                return { currentUser };
            } catch (error) {
                console.error(error);
            }
        }
        return {};
    },
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
