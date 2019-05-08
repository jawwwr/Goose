const Chat = require('../models/chat')

const opts = [{ path: 'room', select: 'room_name' }, { path: 'sender', select: 'user_name' }];

async function findChatByRooms (ctx) {
  const chatByRooms = await Chat.find({})
  const populated = await Chat.populate(chatByRooms, opts)
  ctx.body = populated
}

async function findChatByRoom (ctx) {
  const id = ctx.params.room_id
  const roomChat = await Chat.find({room: id})
  const populated = await Chat.populate(roomChat, opts)
  ctx.body = populated
}

async function create (ctx) {
  const newChat = new Chat(ctx.request.body)
  const savedChat = await newChat.save()
  const populated = await Chat.populate(savedChat, opts)
  ctx.body = populated
}

module.exports = {
  findChatByRooms,
  findChatByRoom,
  create
}