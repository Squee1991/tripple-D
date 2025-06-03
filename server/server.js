import { Server } from "socket.io";

const io = new Server(3001, {
	cors: {
		origin: "*"
	}
})

console.log("Socket на порту 3001")

io.on("connection", (socket) => {
	console.log("Новый игрок")
	socket.on("join", ({ sessionId, uid }) => {
		socket.join(sessionId)
		socket.sessionId = sessionId
		socket.uid = uid
		io.to(sessionId).emit("playerJoined", { uid })
	})

	socket.on("chatMessage", (msg) => {
		io.to(msg.sessionId).emit("chatMessage", msg)
	})

	socket.on("disconnect", () => {
		if (socket.sessionId && socket.uid) {
			io.to(socket.sessionId).emit("playerLeft", { uid: socket.uid })
		}
	})
})
