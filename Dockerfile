FROM alpine
RUN apk add --update nodejs npm
COPY ./build /bot
WORKDIR /bot
RUN npm i
CMD [ "node", "src/main.js" ]
