# FROM node:21-alpine

# WORKDIR /app

# RUN apk update && apk add --no-cache nmap && \
#     echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
#     echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
#     apk update && \
#     apk add --no-cache \
#       chromium \
#       harfbuzz \
#       "freetype>2.8" \
#       ttf-freefont \
#       nss

# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

COPY . .

RUN yarn

CMD ["yarn", "start"]
