FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Exponemos el puerto por defecto de Vite
EXPOSE 5173

# IMPORTANTE: Añadimos --host para que Docker pueda mapear el puerto
CMD ["npm", "run", "dev", "--", "--host"]