/* =============================
2. CLIENT HOOKS
============================= */


import { io, Socket } from 'socket.io-client';
import { useEffect } from 'react';
import { useBuilderStore } from "@state/builderStore"


let socket: Socket;


export function useCollaboration(projectId: string) {
const { updateComponent, selectComponent } = useBuilderStore();


useEffect(() => {
socket = io(process.env.NEXT_PUBLIC_COLLAB_URL!);


socket.emit('join_project', projectId);


socket.on('component_updated', (component) => {
updateComponent(component.id, component);
});


socket.on('selection_updated', ({ userId, selectedId }) => {
// Render other user cursors or highlights
console.log(`User ${userId} selected ${selectedId}`);
});


return () => {
socket.disconnect();
};
}, [projectId]);


const sendUpdate = (component: any) => {
socket.emit('update_component', { projectId, component });
};


const sendSelection = (selectedId: string | null) => {
socket.emit('update_selection', { projectId, selectedId });
};


return { sendUpdate, sendSelection };
}
