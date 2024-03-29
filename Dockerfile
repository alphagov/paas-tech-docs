FROM ghcr.io/alphagov/paas/ruby:8621ead7e4ef0dd653aec80a15b6727b06927e59

ENV RUNTIME_PACKAGES "git nodejs make"
ENV DEV_PACKAGES "python3-pip python3-dev gcc ruby-dev g++ zlib1g-dev libffi-dev"
COPY requirements.txt /tmp/requirements.txt
COPY Gemfile /tmp/Gemfile
COPY Gemfile.lock /tmp/Gemfile.lock

RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get update && apt-get install -y $RUNTIME_PACKAGES $DEV_PACKAGES

RUN pip3 install -r /tmp/requirements.txt \
    && gem install bundle --no-document \
    && cd /tmp && bundle
