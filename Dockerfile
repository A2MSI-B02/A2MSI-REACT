# Étape 1 : build de l'app
FROM node:20-alpine AS build

WORKDIR /app

# Copie des fichiers du projet
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : server nginx pour servir l'app
FROM nginx:alpine

# Suppression du fichier par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie du build React dans nginx
COPY --from=build /app/build /usr/share/nginx/html

# (Facultatif : copier ton propre fichier de conf nginx si besoin)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]