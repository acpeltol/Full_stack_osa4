const mongoose = require('mongoose')

url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url).then(resp => {
    console.log("MongoBD connected")
}).catch((error) => {
    console.log('error message', error.messae)
})

const numSchema = new mongoose.Schema({
        name: {type : String,
          minlength: 3,
          required: true
        },
        number: {type: String,
          minlength : 8,
          required : true,
          validate : {
            validator : function(value){
              return /^\d{2,3}-\d{5,}$/.test(value)
            }
          }
        },
        })
  
numSchema.set('toJSON', {
         transform: (document, returnedObject) => {
           returnedObject.id = returnedObject._id.toString()
           delete returnedObject._id
           delete returnedObject.__v
         }
       })
  
module.exports = mongoose.model("Phonenumbers", numSchema) 