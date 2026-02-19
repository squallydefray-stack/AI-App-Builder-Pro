/* =============================
1. SERVER SETUP (Socket.io)
============================= */


import { Server } from "socket.io";


export function initCollabServer(server: any) {
const io = new Server(server, { cors: { origin: '*' } });


io.on('connection', (socket) => {
console.log('User connected:', socket.id);


socket.on('join_project', (projectId) => {
socket.join(projectId);
socket.to(projectId).emit('user_joined', { userId: socket.id });
});


socket.on('update_component', ({ projectId, component }) => {
socket.to(projectId).emit('component_updated', component);
});


socket.on('update_selection', ({ projectId, selectedId }) => {
socket.to(projectId).emit('selection_updated', { userId: socket.id, selectedId });
});


socket.on('disconnect', () => {
console.log('User disconnected:', socket.id);
// Optionally broadcast leave event
});
});


return io;
}