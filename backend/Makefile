include ./.utils/.ANSI_color.txt

# FILE	= docker-compose.yml
BUILD	= docker-compose build
# FLUSH	= docker-compose exec server python manage.py flush --no-input
MIGRATE	= docker-compose exec server python manage.py migrate --noinput
RUN		= docker-compose up
DOWN	= docker-compose down
DOWN_ALL= docker-compose down -v
PRUNE	= docker system prune -af
# STOP	= docker container stop
RM_NET	= docker network rm -f
CREATE_SU = docker-compose exec server python manage.py createsuperuser

# DATA_PATH	= /home/ccouliba/data/

all: .INIT build run

build: 
	echo "[$(_YELLOW)make$(_END)]:[$(_BLUE)build$(_END)] ---------------------> $(_GREEN)building container(s)$(_END)" ;\
	if $(BUILD) ; then \
	echo "[$(_YELLOW)make$(_END)]:[$(_BLUE)build$(_END)] ---------------------> [ $(_GREEN)DONE$(_END) ]" ;\
	else \
	echo "[$(_YELLOW)make$(_END)]:[$(_BLUE)build$(_END)] -----> building -----> [ $(_RED)FAIL$(_END) ]" ;\
	fi

run:
	echo "[$(_YELLOW)make$(_END)]:[ $(_BLUE)run$(_END) ] ---------------------> $(_GREEN)running container(s)$(_END)" ;\
	if $(RUN) ; then $(MIGRATE) \
	else \
	echo "[$(_YELLOW)make$(_END)]:[ $(_BLUE)run$(_END) ] ------> running -----> [ $(_RED)FAIL$(_END) ]" ;\
	fi

# No need this rule since we use our own User models
create:
	$(CREATE_SU)

clean:
	if $(DOWN) ; then \
	echo "[$(_YELLOW)make$(_END)]:[$(_BLUE)clean$(_END)]  ---------------------> [ $(_GREEN)DONE$(_END) ]" ;\
	fi
# $(STOP) backend frontend datab
# $(RM_NET) transcendance

fclean: clean
	$(PRUNE)
	if $(RM_NET) transcendance ; then \
	echo "[$(_YELLOW)make$(_END)]:[$(_BLUE)fclean$(_END)] ---------------------> [ $(_GREEN)DONE$(_END) ]" ;\
	else \
	echo "[$(_YELLOW)make$(_END)]:[$(_BLUE)fclean$(_END)] -> removing network -> [ $(_RED)FAIL$(_END) ]" ;\
	fi

re: fclean all

.PHONY: all build run create clean fclean re

.SILENT:

# .INIT : <commande à exécuter au début du make>
.INIT:
	echo "\n \t$(_UL_WHITE)make$(_END)\t $(_YELLOW)=>$(_END) [$(_BLUE)all$(_END)] [$(_BLUE)build$(_END)] [$(_BLUE)run$(_END)] [$(_BLUE)create$(_END)] [$(_BLUE)clean$(_END)] [$(_BLUE)fclean$(_END)] [$(_BLUE)re$(_END)] $(_YELLOW)<=$(_END)\n";

# .DONE : <commande exécuter à la fin de make>
.DONE:
	echo "[$(_YELLOW)make$(_END)]:[$(_YELLOW)!$(_END)] Ready to execute binary\t[$(_YELLOW)$(NAME)$(_END)]"


# .IGNORE: Evite au make de s'arrêter en cas d'erreur
# .IGNORE:

# .PRECIOUS: <fichier>* Ne pas détruit pas les fichiers ..
# .PRECIOUS:%