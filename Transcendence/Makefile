include ./.utils/.ANSI_color.txt

RUN		= docker compose up --build

# should use this when running with the -d option
STOP	= docker compose stop
DOWN    = docker compose down -v

DOWN	= docker compose down -v
PRUNE	= docker system prune -af
RM_NET	= docker network rm -f

all: .INIT run

run:
	echo "[$(_YELLOW)make$(_END)]:[ $(_BLUE)run$(_END) ] ---------------------> $(_GREY)running container(s)$(_END)"
	$(RUN)

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

.PHONY: all run clean fclean re

.SILENT:

# .INIT : <commande à exécuter au début du make>
.INIT:
	echo "\n \t$(_UL_WHITE)make$(_END)\t $(_YELLOW)=>$(_END) [$(_BLUE)all$(_END)] [$(_BLUE)run$(_END)] [$(_BLUE)clean$(_END)] [$(_BLUE)fclean$(_END)] [$(_BLUE)re$(_END)] $(_YELLOW)<=$(_END)\n"
