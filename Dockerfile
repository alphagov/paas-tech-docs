FROM ruby:2.7-slim

ENV RUNTIME_PACKAGES "git nodejs make"
ENV DEV_PACKAGES "python3-pip python3-dev gcc ruby-dev g++ zlib1g-dev libffi-dev"
COPY requirements.txt /tmp/requirements.txt
COPY Gemfile /tmp/Gemfile
COPY Gemfile.lock /tmp/Gemfile.lock

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get update && apt-get install -y curl
RUN apt-get update && apt-get install -y $RUNTIME_PACKAGES $DEV_PACKAGES

RUN pip3 install -r /tmp/requirements.txt \
    && gem install bundle --no-document \
    && cd /tmp && bundle
