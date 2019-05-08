/* eslint-disable camelcase */
const User = require('../models/user')
const Room = require('../models/room')

const userOpts = [{ path: 'rooms', select: 'room_name' }];
const roomOpts = [{ path: 'members', select: 'user_name' }, { path: 'creator', select: 'user_name' }];

async function create (ctx) {
  const { body } = ctx.request
  const { user_name, rooms } = body
  const user = await User.findOneAndUpdate({ user_name }, body, {upsert: true})
  const { _id: members } = user

  await Room.findByIdAndUpdate({_id: rooms}, {$addToSet: { members }}, {new: true})
  const Rooms = await Room.find({})
  const roomPopulated = await Room.populate(Rooms, roomOpts)
  const userPopulated = await User.populate(user, userOpts)

  ctx.body = {user: userPopulated, rooms: roomPopulated }
}

async function find (ctx) {
  ctx.body = await User.find({})
}

async function findOne (ctx) {
  const { id } = ctx.params
  const user = await User.findById({_id: id})
  const populated = await User.populate(user, userOpts)
  ctx.body = populated
}

async function update (ctx) {
  const { id } = ctx.params
  const { room } = ctx.request.body
  const updatedUser = await User.findByIdAndUpdate({_id: id}, {$addToSet: { members: room }})
  const populated = await User.populate(updatedUser, userOpts)
  ctx.body = populated
}

async function updateSocket (ctx) {
  const { id } = ctx.params
  const socketId = ctx.request.body.socket_id
  const updatedUser = await User.findByIdAndUpdate({_id: id},{ socket_id: socketId }, {new: true})
  const populated = await User.populate(updatedUser, userOpts)
  ctx.body = populated
}

module.exports = {
  create,
  find,
  findOne,
  update,
  updateSocket
}