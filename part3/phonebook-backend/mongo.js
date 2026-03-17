const mongo = require('mongoose')

// Get password from command line
const password = process.argv[2]

// Check if password provided
if (!password) {
    console.log('Please provide the password as an argument: node mongo.js <password> [name] [number]')
    process.exit(1)
}

// Connection URL – replace with your own cluster details
const url = `mongodb+srv://syforce:${password}@cluster0.xxxxx.mongodb.net/phonebookApp?retryWrites=true&w=majority`

// Define schema and model
const personSchema = new mongo.Schema({
    name: String,
    number: String,
})

const Person = mongo.model('Person', personSchema)

// Connect to MongoDB
mongo.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')

        // Check if name and number provided
        if (process.argv.length === 5) {
            // Add new person
            const name = process.argv[3]
            const number = process.argv[4]

            const person = new Person({
                name: name,
                number: number,
            })

            return person.save().then(() => {
                console.log(`added ${name} number ${number} to phonebook`)
                return mongo.connection.close()
            })
        } else {
            // List all persons
            return Person.find({}).then(persons => {
                console.log('phonebook:')
                persons.forEach(person => {
                    console.log(`${person.name} ${person.number}`)
                })
                return mongo.connection.close()
            })
        }
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err)
        process.exit(1)
    })
