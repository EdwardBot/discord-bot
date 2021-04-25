FROM alpine
RUN apk add --update nodejs npm
RUN npm i -g typescript
COPY . /bot
WORKDIR /bot
RUN npm i
RUN tsc
RUN rm -rf src/*/*.ts
CMD [ "node", "src/main.js" ]
