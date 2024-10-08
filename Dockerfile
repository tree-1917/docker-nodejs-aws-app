# Stage 0 
# [Base Image] 
FROM node:latest as base
# [Working Dir]
WORKDIR /app
# [Working Dir / package.json]
COPY package.json .

# stage 1 
# [Base Image] 
FROM base as development 
# [Working Dir / package-lock.json]
RUN npm install 
# [Working Dir / index.js]
COPY . .
# Expose Port 
EXPOSE  4002
# Run Application 
CMD [ "npm", "run", "start-dev" ]

# stage 2 
# [Base Image]
FROM base as production 
# [Working Dir / package-lock.json]
RUN npm install --only=production 
# [Working Dir / index.js]
COPY . .
# Expose Port 
EXPOSE  4002
# Run Application 
CMD [ "npm", "run", "start" ]