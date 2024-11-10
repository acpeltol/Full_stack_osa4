const mongoose = require('mongoose')

if (process.argv.length === 5) {

  const password = process.argv[2]

  console.log(encodeURIComponent(password))

  // Updated URL with encoded password
  const url = `mongodb+srv://fullstackw:${encodeURIComponent(password)}@klusteri.nosxb.mongodb.net/PhoneBookApp?retryWrites=true&w=majority&appName=Klusteri`

  mongoose.set('strictQuery', false)

  mongoose.connect(url)
    .then(() => {
      console.log('Connected to MongoDB')

      const noteSchema = new mongoose.Schema({
        name: String,
        number: String,
      })

      const Note = mongoose.model('Phonenumbers', noteSchema)

      const tnote = new Note({
        name: process.argv[3],
        number: process.argv[4]
      })

      return tnote.save()
    })
    .then(() => {
      console.log(`Added ${process.argv[3]} number ${process.argv[4]} to phonebook!`)
      mongoose.connection.close()
    })
    .catch(error => {
      console.error('Error saving note:', error.message)
      console.error('Full error details:', error)
      mongoose.connection.close()
    })}

else if (process.argv.length === 3){

  const password = process.argv[2]

  // Updated URL with encoded password
  const url = `mongodb+srv://fullstackw:${encodeURIComponent(password)}@klusteri.nosxb.mongodb.net/PhoneBookApp?retryWrites=true&w=majority&appName=Klusteri`

  mongoose.set('strictQuery', false)

  mongoose.connect(url).then(() => {

    const noteSchema = new mongoose.Schema({
      name: String,
      number: String,
    })

    const Note = mongoose.model('Phonenumbers', noteSchema)

    return Note.find({})
  }).then(
    result => {
      console.log('phonebook:')
      result.forEach(note => {
        console.log(`${note.name} ${note.number}`)
      })
      mongoose.connection.close()
    }
  )
}