import io from "socket.io-client";

const URL: string = "http://localhost:3000";
export const socket = io(URL);

export default socket;

// TODO: Currently Exporting two socket instances, need to fix this
