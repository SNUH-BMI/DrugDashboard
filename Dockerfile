FROM nginx:stable

RUN mkdir /app

WORKDIR /app

RUN mkdir ./build

COPY ./front/drugdashboard_react/build ./build

RUN mkdir ./dist

COPY ./frontVue/app/dist ./dist

RUN rm /etc/nginx/conf.d/default.conf
COPY conf/nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]