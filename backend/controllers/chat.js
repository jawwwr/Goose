const Chat = require('../models/chat')

async function findChatByRooms (ctx) {
  // Fetch all Chat's from the database and return as payload
  const chatByRooms = await Chat.find({})
  const opts = [{ path: 'room', select: 'room_name' }, { path: 'sender', select: 'user_name' }];
  const populated = await Chat.populate(chatByRooms, opts)
  ctx.body = populated
}

async function findChatByRoom (ctx) {
  // Fetch all Chat's from the database and return as payload
  const { roomId } = ctx.params
  const roomChat = await Chat.find({room_id: roomId})
  ctx.body = roomChat
}

async function create (ctx) {
  // Create New Chat from payload sent and save to database
  const newChat = new Chat(ctx.request.body)
  const savedChat = await newChat.save()
  ctx.body = savedChat
}

module.exports = {
  findChatByRooms,
  findChatByRoom,
  create
}