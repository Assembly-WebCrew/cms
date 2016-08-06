FROM node
MAINTAINER Assembly WebCrew <web@assembly.org>
RUN apt-get update
RUN apt-get install -y curl python3 python3-pip
RUN ln -sf /usr/bin/python3 /usr/bin/python
RUN ln -sf /usr/bin/pip3 /usr/bin/pip
ENV PYTHONUNBUFFERED 1
RUN pip install pip --upgrade
RUN pip install setuptools --upgrade
RUN npm install --loglevel=warn --global gulp bower
RUN mkdir /code
WORKDIR /code