const User = require('../models/user')

async function create (ctx) {
  // Create New User from payload sent and save to database
  const newUser = new User(ctx.request.body)
  const savedUser = await newUser.save()
  ctx.body = savedUser
}

async function find (ctx) {
  // List users
  ctx.body = await User.find({})
}

async function findOne (ctx) {
  // Find User by Id
  const { id: _id } = ctx.params
  ctx.body = await User.findOne({_id})
}

module.exports = {
  create,
  find,
  findOne
}