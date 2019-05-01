const User = require('../models/user')

async function create (ctx) {
  // Create New User from payload sent and save to database
  const newUser = new User(ctx.request.body)
  const savedUser = await newUser.save()
  ctx.body = savedUser
}

module.exports = {
  create
}