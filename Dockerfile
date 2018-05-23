FROM ruby:2.5-alpine

ENV RUNTIME_PACKAGES "python git nodejs make"
ENV DEV_PACKAGES "py-pip python-dev musl-dev gcc ruby-dev g++ zlib-dev libffi-dev"
COPY requirements.txt /tmp/requirements.txt
COPY Gemfile /tmp/Gemfile
COPY Gemfile.lock /tmp/Gemfile.lock
RUN apk add --update $RUNTIME_PACKAGES
RUN apk add $DEV_PACKAGES \
  && pip install -r /tmp/requirements.txt \
  && gem install bundle --no-document \
  && cd /tmp && bundle \
  && apk del $DEV_PACKAGES \
  && rm -rf /var/cache/apk/*
