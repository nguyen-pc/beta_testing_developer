import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const useNotificationSocket = (
  userId: number,
  onMessage: (msg: any) => void
) => {
  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS("http://localhost:8081/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Connected to WebSocket notifications");
        client.subscribe(`/topic/notifications/${userId}`, (message) => {
          const payload = JSON.parse(message.body);
          onMessage(payload);
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [userId]);
};
