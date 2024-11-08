FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN npm config set strict-ssl false

RUN npm install --force --log-level=verbose --force --log-level=verbose

COPY . .

CMD ["npm", "start"]