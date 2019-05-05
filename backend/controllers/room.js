const Room = require('../models/room')


async function find (ctx) {
  // Fetch all Chat's from the database and return as payload
  const Rooms = await Room.find({})
  const opts = [{ path: 'members', select: 'user_name' }, { path: 'creator', select: 'user_name' }];
  const populated = await Room.populate(Rooms, opts)
  ctx.body = populated
}

async function findOne (ctx) {
  const { id } = ctx.params
  const RoomDetail = await Room.findById({_id: id})
  const opts = [{ path: 'members', select: 'user_name' }, { path: 'creator', select: 'user_name' }];
  const populated = await Room.populate(RoomDetail, opts)
  ctx.body = populated
}

async function create (ctx) {
  // Create New User from payload sent and save to database
  const newRoom = new Room(ctx.request.body)
  const savedRoom = await newRoom.save()
  ctx.body = savedRoom
}

async function update (ctx) {
  const { id } = ctx.params
  const { members } = ctx.request.body
  const updatedRoom = await Room.findByIdAndUpdate({_id: id}, {$addToSet: { members }})
  const opts = [{ path: 'members', select: 'user_name' }, { path: 'creator', select: 'user_name' }];
  const populated = await Room.populate(updatedRoom, opts)
  ctx.body = populated
}

module.exports = {
  create,
  find,
  findOne,
  update
}