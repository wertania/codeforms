# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production 
COPY . .

# ---- Release ----
FROM base AS release
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV PORT=3000

EXPOSE $PORT
CMD [ "node", "index.js" ]