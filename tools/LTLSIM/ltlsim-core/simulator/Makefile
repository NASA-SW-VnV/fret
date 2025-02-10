CC=gcc
CFLAGS= -I. -g -Wall

ifeq ($(OS), Windows_NT)
	CFLAGS += -DWINDOWS
endif

#If you want to keep the temporary smv files, uncomment the next line.
#CFLAGS += -DKEEP_TMP_FILES

HEADERS = \
		ltlsim_commands.h \
		ltlsim_smvutils.h \
		ltlsim_types.h
OBJECTS = \
		ltlsim_commands.o \
		ltlsim_smvutils.o \
		ltlsim_types.o


ltlsim: $(OBJECTS)
	$(CC) $@.c $^ -o $@ $(CFLAGS)

%.o: %.c $(HEADERS)
	$(CC) -c -o $@ $< $(CFLAGS)

.PHONY: clean

clean:
	rm -f *.o
