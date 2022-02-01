FROM python:3.9-slim
LABEL maintainer="Oleg Yapparov <oyapparov@gmail.com>"
WORKDIR app

ENV VIRTUAL_ENV=/opt/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install dependencies:
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy app
COPY api ./app/api
COPY kamenice_django ./app/kamenice_django
COPY locale ./app/locale
COPY ui/views.py ./app/ui/views.py

# Migrate ans run the application:
COPY manage.py ./app
RUN python app/manage.py migrate --settings=kamenice_django.settings.development

CMD ["python", "app/manage.py", "runserver", "0.0.0.0:8000", "--settings=kamenice_django.settings.development"]