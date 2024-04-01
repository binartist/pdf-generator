FROM node:21-alpine

WORKDIR /app

RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      nss

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY . .

# RUN yarn config set registry 'https://registry.npm.taobao.org'
# RUN PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org yarn
RUN yarn

EXPOSE 3000

CMD ["yarn", "start"]