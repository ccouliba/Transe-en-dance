include ./.utils/.ANSI_color.txt

BUILD	= docker-compose build
# FLUSH	= docker-compose exec server python manage.py flush --no-input
MIGRATE	= docker-compose exec web python3 manage.py migrate
RUN		= docker-compose up -d # without the flag '-d', you should see in verbose server running
DOWN	= docker-compose down
DOWN_ALL= docker-compose down -v
PRUNE	= docker system prune -af
RM_NET	= docker network rm -f
CREATE_SU = docker-compose exec web python manage.py createsuperuser

all: .INIT build run

build: 
	echo "[$(_YELLOW)make$(_END)]:[$(_BLUE)build$(_END)] ---------------------> $(_GREEN)building container(s)$(_END)"
	if $(BUILD) ; then \
		echo "[$(_YELLOW)make$(_END)]:[$(_BLUE)build$(_END)] ---------------------> [ $(_GREEN)DONE$(_END) ]" ;\
	else \
		echo "[$(_YELLOW)make$(_END)]:[$(_BLUE)build$(_END)] -----> building -----> [ $(_RED)FAIL$(_END) ]" ;\
	fi

run:
	echo "[$(_YELLOW)make$(_END)]:[ $(_BLUE)run$(_END) ] ---------------------> $(_GREEN)running container(s)$(_END)"
	if $(RUN) ; then \
		$(MIGRATE) ; \
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
	echo "\n \t$(_UL_WHITE)make$(_END)\t $(_YELLOW)=>$(_END) [$(_BLUE)all$(_END)] [$(_BLUE)build$(_END)] [$(_BLUE)run$(_END)] [$(_BLUE)create$(_END)] [$(_BLUE)clean$(_END)] [$(_BLUE)fclean$(_END)] [$(_BLUE)re$(_END)] $(_YELLOW)<=$(_END)\n"
