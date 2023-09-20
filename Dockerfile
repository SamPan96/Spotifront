# build environment
FROM node:20-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
RUN apk add npm
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
#RUN export NODE_OPTIONS=--max-old-space-size=8192
CMD ["node","./src/App.js"]


# RUN npm install react-scripts@3.4.1 -g --silent
# COPY . ./
# RUN npm run build

# # production environment
# FROM nginx:stable-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# # new
# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
