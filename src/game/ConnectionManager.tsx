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

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Dummy state for now
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'مهدی', color: '#3b82f6', x: 100, y: 120 },
    { id: '2', name: 'سارا', color: '#f59e42', x: 200, y: 180 },
  ]);
  const [myId] = useState('1');
  const [status] = useState<'connecting' | 'connected' | 'disconnected'>('connected');
  const [ping] = useState(42);

  // Placeholder for sending position
  const sendPosition = (x: number, y: number) => {
    // In real impl: send via WebSocket
    setPlayers((prev) => prev.map(p => p.id === myId ? { ...p, x, y } : p));
  };

  return (
    <ConnectionContext.Provider value={{ players, myId, status, ping, sendPosition }}>
      {children}
    </ConnectionContext.Provider>
  );
}; 