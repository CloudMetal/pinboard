
BOOKMARK = ./libs/bookmarklet
APP = ./libs/pinboard

build: 
	$(MAKE) -C $(BOOKMARK) build
	$(MAKE) -C $(APP) build

clean:
	$(MAKE) -C $(BOOKMARK) clean
	$(MAKE) -C $(APP) clean

.PHONY: clean
