# Image de base
FROM node:20-alpine
# Repertoire de travaill
WORKDIR /app
# Copie des fichiers
COPY . .

# Installation des dépendances
RUN npm install --force
# Exposer le port
EXPOSE 5173
# Lancer
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]
