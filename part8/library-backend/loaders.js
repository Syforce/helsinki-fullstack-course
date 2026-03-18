const DataLoader = require('dataloader');
const Book = require('./models/book');

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

module.exports = { bookCountLoader };
