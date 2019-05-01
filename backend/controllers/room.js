const Room = require('../models/room')

async function create (ctx) {
  // Create New User from payload sent and save to database
  const newRoom = new Room(ctx.request.body)
  const savedRoom = await newRoom.save()
  ctx.body = savedRoom
}

module.exports = {
  create
}