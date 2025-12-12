"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
    })

    socketInstance.on("connect", () => {
      console.log("[v0] Socket connected")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("[v0] Socket disconnected")
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return { socket, isConnected }
}
