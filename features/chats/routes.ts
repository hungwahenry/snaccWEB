export const chatRoomPath = (roomId: string) =>
  `/chat/${encodeURIComponent(roomId)}`
