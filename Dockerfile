FROM node

WORKDIR /app

COPY . .

RUN npm i @nestjs/cli && npm i && npm run build

ENV PORT 3051

EXPOSE $PORT

CMD ["node", "dist/main.js"]