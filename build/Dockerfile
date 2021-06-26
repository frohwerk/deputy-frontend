FROM nginx:1.21
RUN rm -f /docker-entrypoint.d/*.sh
COPY nginx/ /etc/nginx/
COPY deputy-frontend/ /usr/share/nginx/html
RUN mkdir -p /etc/nginx/nginx.conf.d \
 && chgrp -R 0 /var/run \
 && chgrp -R 0 /etc/nginx \
 && chgrp -R 0 /var/log/nginx \
 && chgrp -R 0 /var/cache/nginx \
 && chgrp -R 0 /usr/share/nginx/html \
 && chgrp -R 0 /etc/nginx/nginx.conf.d \
 && chmod -R g+rwX /var/run \
 && chmod -R g+rwX /etc/nginx \
 && chmod -R g+rwX /var/log/nginx \
 && chmod -R g+rwX /var/cache/nginx \
 && chmod -R g+rwX /usr/share/nginx/html \
 && chmod -R g+rwX /etc/nginx/nginx.conf.d \
 && chmod -R go+X /usr/share/nginx/html
EXPOSE 8443