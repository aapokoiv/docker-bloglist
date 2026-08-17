const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, object) => {
    object.id = object._id.toString()
    delete object._id
    delete object.__v
    delete object.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
