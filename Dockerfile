FROM ruby:2.7-alpine

ENV RUNTIME_PACKAGES "python3 git nodejs make"
ENV DEV_PACKAGES "py3-pip python3-dev musl-dev gcc ruby-dev g++ zlib-dev libffi-dev"
COPY requirements.txt /tmp/requirements.txt
COPY Gemfile /tmp/Gemfile
COPY Gemfile.lock /tmp/Gemfile.lock

RUN apk add --no-cache $RUNTIME_PACKAGES
RUN apk add --no-cache $DEV_PACKAGES
RUN pip3 install -r /tmp/requirements.txt \
    && gem install bundle --no-document \
    && cd /tmp && bundle
