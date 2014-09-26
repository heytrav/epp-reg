
FROM ubuntu:trusty
MAINTAINER Travis Holton <travis@ideegeo.com>

WORKDIR /root

ADD config /root/config
ADD lib /root/lib
ADD test /root/test


