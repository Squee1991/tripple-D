import { io } from 'socket.io-client'

let socket

export  default function useSocket() {
	if (!socket) {
		socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001')
	}
	return socket
}