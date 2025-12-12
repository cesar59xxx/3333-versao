"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://incredible-exploration-production-5a86.up.railway.app"

let socketInstance: Socket | null = null

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io(BACKEND_URL, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })
    }

    const onConnect = () => setIsConnected(true)
    const onDisconnect = () => setIsConnected(false)

    socketInstance.on("connect", onConnect)
    socketInstance.on("disconnect", onDisconnect)

    if (socketInstance.connected) {
      setIsConnected(true)
    }

    return () => {
      socketInstance?.off("connect", onConnect)
      socketInstance?.off("disconnect", onDisconnect)
    }
  }, [])

  return { socket: socketInstance, isConnected }
}
