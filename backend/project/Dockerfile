# pull official base image
FROM python:3.11.4-slim-buster

# set work directory
WORKDIR /usr/src/backend

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN apt-get update && apt-get install gettext -y
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt
RUN pip install reportlab
RUN pip install django-cors-headers

RUN python -m pip install Pillow

# copy project
COPY . .
