FROM nginx:1.27.1

RUN apt-get update -y && apt-get install apache2-utils -y

COPY nginx.conf /etc/nginx/nginx.conf
RUN htpasswd -bc /etc/nginx/.htpasswd admin admin

ENTRYPOINT [ "nginx" ]
CMD [ "-g", "daemon off;" ]
