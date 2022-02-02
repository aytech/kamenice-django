FROM python:3.9-slim
LABEL maintainer="Oleg Yapparov <oyapparov@gmail.com>"
WORKDIR /app

ENV VIRTUAL_ENV=/opt/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install dependencies:
COPY requirements.txt /app/
RUN pip install -r requirements.txt