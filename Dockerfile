FROM alpine:3.9.4

WORKDIR /app
RUN apk update && apk add nodejs npm mariadb-client imagemagick
RUN node -v

EXPOSE 3000
