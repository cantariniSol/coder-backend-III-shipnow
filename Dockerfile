FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY --chown=node:node src ./src

RUN mkdir -p logs uploads/order-proofs uploads/user-documents \
	&& chown -R node:node logs uploads

USER node

EXPOSE 3001

CMD ["npm", "start"]