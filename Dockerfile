### STAGE 1: Build ###
FROM node:16-alpine as build
WORKDIR /build
ADD package.json package-lock.json ./
RUN npm install
COPY . . 
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.21-alpine
ENV NODE_ENV=production

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/dist/gongfu/ /usr/share/nginx/html
