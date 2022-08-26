FROM buildkite/puppeteer:latest

WORKDIR /usr/src/

COPY . .

# RUN yarn config set registry 'https://registry.npm.taobao.org'
# RUN PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org yarn install
RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]