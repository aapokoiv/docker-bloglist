FROM node:24

WORKDIR /usr/src/app

COPY . .

RUN npm ci --omit=dev

CMD ["npm", "start"]
