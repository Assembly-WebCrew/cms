FROM node
MAINTAINER Assembly WebCrew <web@assembly.org>
RUN apt-get update
RUN apt-get install -y curl python3 python3-pip
RUN ln -sf /usr/bin/python3 /usr/bin/python
RUN ln -sf /usr/bin/pip3 /usr/bin/pip
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/
RUN npm install --global gulp bower
RUN npm run build