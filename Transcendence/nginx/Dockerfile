FROM nginx:1.27.1

ARG KIBANA_NAME
ARG KIBANA_PASS

RUN apt-get update -y && apt-get install apache2-utils -y

COPY nginx.conf /etc/nginx/nginx.conf
# -bc Create new file and take input from command-line
RUN htpasswd -bc /etc/nginx/.htpasswd ${KIBANA_NAME} ${KIBANA_PASS}

ENTRYPOINT [ "nginx" ]
CMD [ "-g", "daemon off;" ]
