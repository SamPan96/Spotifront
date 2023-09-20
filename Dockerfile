# build environment
# # WORKDIR /app
# # ENV PATH /app/node_modules/.bin:$PATH
# # COPY package.json ./
# # RUN apk add npm
# # RUN npm install --legacy-peer-deps
# # COPY . .
# # EXPOSE 3000
# # #RUN export NODE_OPTIONS=--max-old-space-size=8192
# # RUN npm run start

# # production environment
# FROM nginx:stable-alpine
# RUN npm install react-scripts@3.4.1 -g --silent
# COPY . ./
# RUN npm run build
# COPY /app/build /usr/share/nginx/html
# # new
# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

FROM node:17-alpine as BUILDER
WORKDIR /app
COPY package.json package-lock.json ./
RUN apk add npm
COPY public/ public/
COPY src/ src/
RUN npm ci
RUN npm run build

FROM nginx:stable-alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
USER nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
