FROM node:20 AS node_builder
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn
RUN NODE_OPTIONS=--max_old_space_size=4000 yarn build

FROM nginxinc/nginx-unprivileged:1.21

USER root
COPY --from=node_builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]