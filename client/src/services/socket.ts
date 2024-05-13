import io from "socket.io-client";

const URL: string = "/";
export const socket = io(URL);

export default socket;

// TODO: Currently Exporting two socket instances, need to fix this
