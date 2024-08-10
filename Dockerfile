From node:20

WORKDIR /app

COPY . .

RUN npm install

EXPOSE ${PORT}

# npm run start:dev
CMD ["npm","run","start:dev"]
