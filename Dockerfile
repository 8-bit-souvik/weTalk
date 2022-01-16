FROM node:alpine
# ENV NODE_ENV=production
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY . /app/
CMD ["npm", "start"]
# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --production --silent && mv node_modules ../

# EXPOSE 5510
# RUN chown -R node /usr/src/app
# USER node
# CMD ["npm", "start"]
