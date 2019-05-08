const Room = require('../models/room')
const User = require('../models/user')

const userOpts = [{ path: 'rooms', select: 'room_name' }];
const roomOpts = [{ path: 'members', select: ['user_name', 'socket_id'] }, { path: 'creator', select: 'user_name' }];

async function find (ctx) {
  // Fetch all Chat's from the database and return as payload
  const Rooms = await Room.find({})
  const populated = await Room.populate(Rooms, roomOpts)
  ctx.body = populated
}

async function findOne (ctx) {
  const { id } = ctx.params
  const RoomDetail = await Room.findById({_id: id})
  const populated = await Room.populate(RoomDetail, roomOpts)
  ctx.body = populated
}

async function checkRooms (ctx) {
  const { type, fId, sId } = ctx.params
  const room = await Room.find({type,
    members: { $all: [fId, sId] }
    })
  const populated = await Room.populate(room, roomOpts)
  ctx.body = populated
}

async function create (ctx) {
  // Create New User from payload sent and save to database
  const newRoom = new Room(ctx.request.body)
  const { creator } = newRoom
  const room = await newRoom.save()
  const user = await User.findByIdAndUpdate({_id: creator}, {$addToSet: { rooms: room.id }}, {new: true})
  const roomPopulated = await Room.populate(room, roomOpts)
  const userPopulated = await User.populate(user, userOpts)
  ctx.body = { room: roomPopulated, user: userPopulated}
}

async function update (ctx) {
  const { id } = ctx.params
  const { members } = ctx.request.body
  const updatedRoom = await Room.findByIdAndUpdate({_id: id}, {$addToSet: { members }})
  const populated = await Room.populate(updatedRoom, roomOpts)
  ctx.body = populated
}

module.exports = {
  create,
  find,
  findOne,
  update,
  checkRooms
}