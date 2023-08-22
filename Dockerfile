FROM --platform=linux/amd64 node:16
# FROM node:11.12.0-alpine

# create an app directory and use it as working directory
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     # We install Chrome to get all the OS level dependencies, but Chrome itself
     # is not actually used as it's packaged in the node puppeteer library.
     # Alternatively, we could could include the entire dep list ourselves
     # (https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)
     # but that seems too easy to get out of date.
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/* \
     && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
     && chmod +x /usr/sbin/wait-for-it.sh 


RUN mkdir -p /og-image
WORKDIR /og-image

# setting up directory for node_modules to bin path so that containers folder can be used
ENV PATH /og-image/node_modules/.bin:$PATH

COPY package.json /og-image/package.json
COPY public/fonts/NotoColorEmoji-Regular.ttf ./
RUN mkdir -p /usr/share/fonts/truetype/
RUN install -m644 NotoColorEmoji-Regular.ttf /usr/share/fonts/truetype/
RUN rm ./NotoColorEmoji-Regular.ttf
# COPY package-lock.json /og-image/package-lock.json

# # RUN apk add --no-cache --virtual .gyp

# # RUN apk add --no-cache --virtual python

# # RUN apk add --no-cache --virtual make

# # RUN apk add --no-cache --virtual g++

# # RUN apk add --no-cache autoconf automake

# RUN apk add --no-cache nasm pkgconfig libtool build-base zlib-dev
RUN npm config set unsafe-perm true
RUN npm install        

RUN npm install pm2@latest -g
RUN npm install db-migrate -g
RUN npm install cross-env -g

COPY . /og-image

# allow ports to be publicly available
EXPOSE 4000

# run command
CMD pm2 start pm2.json && tail -f /dev/null
