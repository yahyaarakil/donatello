import websockets
import asyncio

async def echo(websocket):
    try:
        print('User connected')
        await websocket.send("""{"type": "MessageType.POST_COMMAND", "field": "", "payload": ""}""")
        print("sent")
        while True:
            message = await websocket.recv()
            print(f"<<< {message}")

            await websocket.send(message)
            print(f">>> {message}")
    
    except websockets.exceptions.ConnectionClosed:
        print('User disconnected')

async def main():
    async with websockets.serve(echo, "localhost", 5050):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())