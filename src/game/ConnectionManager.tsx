import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export type Player = {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
};

interface ConnectionContextType {
  players: Player[];
  myId: string;
  status: 'connecting' | 'connected' | 'disconnected';
  ping: number;
  sendPosition: (x: number, y: number) => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const useConnection = () => {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error('useConnection must be used within ConnectionProvider');
  return ctx;
};

function randomColor() {
  const colors = ['#3b82f6', '#f59e42', '#10b981', '#e11d48', '#a21caf', '#fbbf24'];
  return colors[Math.floor(Math.random() * colors.length)];
}
function randomName() {
  const names = ['مهدی', 'سارا', 'آرش', 'نگین', 'علی', 'زهرا', 'رضا', 'نازنین'];
  return names[Math.floor(Math.random() * names.length)];
}
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [myId] = useState(() => uuidv4());
  const [myName] = useState(() => randomName());
  const [myColor] = useState(() => randomColor());
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [ping, setPing] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const pingStart = useRef<number>(0);

  // Connect to WebSocket server
  useEffect(() => {
    let ws: WebSocket;
    let pingInterval: NodeJS.Timeout;
    let reconnectTimeout: NodeJS.Timeout;
    function connect() {
      setStatus('connecting');
      ws = new window.WebSocket('ws://localhost:3001');
      wsRef.current = ws;
      ws.onopen = () => {
        setStatus('connected');
        ws.send(JSON.stringify({
          type: 'join',
          id: myId,
          name: myName,
          color: myColor,
          x: 100,
          y: 100,
        }));
        // Start ping
        pingInterval = setInterval(() => {
          if (ws.readyState === ws.OPEN) {
            pingStart.current = Date.now();
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 3000);
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'players') {
            setPlayers(data.players);
          }
          if (data.type === 'pong') {
            setPing(Date.now() - pingStart.current);
          }
        } catch {}
      };
      ws.onclose = () => {
        setStatus('disconnected');
        clearInterval(pingInterval);
        // Try to reconnect after 2s
        reconnectTimeout = setTimeout(connect, 2000);
      };
      ws.onerror = () => {
        ws.close();
      };
    }
    connect();
    return () => {
      clearInterval(pingInterval);
      clearTimeout(reconnectTimeout);
      ws && ws.close();
    };
    // eslint-disable-next-line
  }, [myId, myName, myColor]);

  // Send position to server
  const sendPosition = (x: number, y: number) => {
    if (wsRef.current && wsRef.current.readyState === wsRef.current.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'move',
        id: myId,
        x,
        y,
      }));
    }
    setPlayers((prev) => prev.map(p => p.id === myId ? { ...p, x, y } : p));
  };

  return (
    <ConnectionContext.Provider value={{ players, myId, status, ping, sendPosition }}>
      {children}
    </ConnectionContext.Provider>
  );
}; 