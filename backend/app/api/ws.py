"""
WebSocket Live Telemetry and Event Dispatch.
"""

from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import asyncio

router = APIRouter(tags=["WebSockets"])


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass


manager = ConnectionManager()


@router.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial handshake
        await websocket.send_json({
            "type": "CONNECTION_ESTABLISHED",
            "message": "Quantum Threat Detection Telemetry Connected",
            "backend": "Qiskit Aer (Local)"
        })
        while True:
            # Keep-alive receive
            data = await websocket.receive_text()
            # Echo or process incoming commands
            try:
                payload = json.loads(data)
                if payload.get("action") == "PING":
                    await websocket.send_json({"type": "PONG", "timestamp": str(asyncio.get_event_loop().time())})
            except Exception:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
