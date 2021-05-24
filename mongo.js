const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.ojo7z.mongodb.net/fullstackopenphonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then((result) => {
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
    const person = new Person({
      name,
      number
    })
    person.save().then(() => {
        console.log(
          `\r\n added ${name}: ${number} to phonebook.`
        )
        mongoose.connection.close()
    })
}

if (process.argv.length === 4 || process.argv.length > 5) {
    console.log('Number of incorrect arguments')
}
