FROM node:20-alpine

WORKDIR /app

# Instalamos dependencias primero para aprovechar el sistema de capas de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de NestJS
EXPOSE 3000

# Arrancamos en modo desarrollo con watch
CMD ["npm", "run", "start:dev"]