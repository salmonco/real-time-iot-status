import { createContext, useContext } from "react";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5001";

const socket = io(ENDPOINT);
const SocketContext = createContext(socket);

export const useSocket = () => {
  return useContext(SocketContext);
};
