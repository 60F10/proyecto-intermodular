Scale module and serial port

This project includes a `ScaleModule` that reads weight data from a serial port and exposes a simple endpoint: `GET /scale/weight`.

Install backend dependencies (this will include `serialport` if present in optionalDependencies):

```bash
cd backend
npm install
```

To run inside Docker (recommended on Windows to avoid native build tool issues), rebuild the backend image and start the service:

```bash
docker-compose build backend && docker-compose up -d backend
```

If `serialport` isn't installed, the `ScaleService` starts in degraded mode and the endpoint will return the latest known value (or null). Install `serialport` to enable live reading.

Environment variables:

- `SCALE_PORT` (default `COM1`) — serial device path (e.g. `/dev/ttyUSB0`)
- `SCALE_BAUD` (default `9600`) — baud rate

Example (local): `SCALE_PORT=/dev/ttyUSB0 SCALE_BAUD=9600 npm run start:dev`
