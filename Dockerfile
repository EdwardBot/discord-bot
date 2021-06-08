FROM alpine
RUN apk add --update nodejs npm
RUN npm i -g typescript
COPY ./build /bot
WORKDIR /bot
RUN npm i
CMD [ "node", "src/main.js" ]
