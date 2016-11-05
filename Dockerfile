
FROM ubuntu:trusty
MAINTAINER Travis Holton <wtholton at Gee mail dot com>

WORKDIR /root

ADD config /root/config
ADD lib /root/lib
ADD test /root/test


