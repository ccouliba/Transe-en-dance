"""
Django settings for server project.

Generated by 'django-admin startproject' using Django 4.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""
import os
from django.utils.translation import gettext_lazy as _
from pathlib import Path
# from logstash import LogstashHandler
# from logging import FileHandler, StreamHandler
# from elasticsearch import RequestsHttpConnection

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = 'django-insecure-o=4*ygn5oz$&iw6-ru(t=c+7wx2fjl9bs9xlka3b*@-204-vgn'
SECRET_KEY = os.getenv("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
# DEBUG = bool(os.environ.get("DEBUG", default=0))

# 'DJANGO_ALLOWED_HOSTS' should be a single string of hosts with a space between each.
# For example:'DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]'
# ALLOWED_HOSTS = ['bess-f*r*s*.clusters.42paris.fr' 'localhost' '127.0.0.1']
ALLOWE_HOSTS = []
# ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(" ")

# For dev environnement, i have to comment these parameters
# SECURE_SSL_REDIRECT = True
# CSRF_COOKIE_SECURE = True
# SESSION_COOKIE_SECURE = True

# Application definition

INSTALLED_APPS = [
    # 'elasticapm.contrib.django',
	'pong',
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
    # 'django_elasticsearch_dsl',
    # 'django_elasticsearch_dsl_drf',
]

# ELASTIC_APM = {
#   'SERVICE_NAME': 'my-service-name',
#   'SECRET_TOKEN': 'DJMayVBz6V3GiHWAfC',
#   'SERVER_URL': 'https://9f09a6004982450f8d7de133ffe845f3.apm.us-central1.gcp.cloud.es.io:443',
#   'ENVIRONMENT': 'my-environment',
# }

MIDDLEWARE = [
    # 'elasticapm.contrib.django.middleware.TracingMiddleware',
    # 'logstash.middleware.LogMiddleware.UserLoginLogMiddleware',
    # 'logstash.middleware.LogMiddleware.UserRegisterLogMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'server.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'pong', 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'pong.context_variables_processors.texts_to_translate',
            ],
        },
    },
]

WSGI_APPLICATION = 'server.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': os.getenv('SQL_ENGINE', 'django.db.backends.postgresql_psycopg2'),
        'NAME': os.getenv('SQL_DATABASE', 'db1'),
        'USER': os.getenv('SQL_USER', 'ccouliba'),
        'PASSWORD': os.getenv('SQL_PASSWORD'),
        'HOST': os.getenv('SQL_HOST', 'db'),
        'PORT': os.getenv('SQL_PORT', '5432'),
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
	{
		'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
	},
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGES = [
    ('en', _('English')),
    ('fr', _('French')),
    ('it', _('Italian')),
    ('es', _('Spanish')),
    ('de', _('Deutsch')),
    ]

LANGUAGE_COOKIE_NAME = 'language'

# Path to translation files (.po and .mo once compilation is done)
LOCALE_PATHS = [ os.path.join(BASE_DIR, 'locale'), ]

LANGUAGE_CODE = 'en-us'

USE_TZ = True

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'pong.User'

LOGIN_REDIRECT_URL = '/pong/home'
LOGOUT_REDIRECT_URL = '/pong/login'

# to manage static files (e.g. images, JavaScript, CSS)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

# STATIC_URL = "static/"

STATICFILES_DIRS = [
	os.path.join(BASE_DIR, 'pong/static'),
]

# Chemin pour les fichiers statiques collectés (utilisé avec collectstatic)
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# For logging (devops)
LOGGING = {
    # Defines the dict version for logging config ; Should always be 1 ; another value seems to cause issues
    'version': 1,
    'disable_existing_loggers': False, # ?q= false -> not activated
    'formatters': {
        'verbose': {
            'format': '[%(asctime)s]::[%(levelname)s]::[%(funcName)s]::[%(name)s] => %(message)s',
            'datefmt': '%Y/%m/%d %H:%M:%S',
        },
        'simple': {
            'format': '[%(levelname)s] => %(message)s',
        },
    },
    
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '../project/logs/pong.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'stream': 'sys.stdout',
            'formatter': 'simple',
            # 'port': 5959, # Default
            # 'version': 1,
            # 'message_type': 'django', 
            # 'fqdn': False,
            # 'tags': ['django.request'],
        },
        # 'logstash': {
        #     'level': 'DEBUG',
        #     'class': 'logstash.LogstashTCPHandler',
        #     # 'host': 'adresse_IP_de_Logstash',
        #     'port': 5959,
        #     'formatter': 'simple',
        # },
    },
    
    'loggers': {
        'pong': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True, # If logs should be propagte to parent logs
        },
        'django.db.backend': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

## FOR ELASTICSEARCH APP 

ELASTICSEARCH_DSL = {
    'default': {
        'hosts': {
            'http://elasticsearch:9200',
            'http://elasticsearch:9300',
        },
        # 'http_auth': ('user', 'password'),
        # 'use_ssl': True,
        # 'verify_certs': True,
        # 'connection_class': 'RequestsHttpConnection',
    },
}