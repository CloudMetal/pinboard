
SRC = $(wildcard client/*/*.js)
HTML = $(wildcard client/*/*.html)
TEMPLATES = $(HTML:.html=.js)

BOOKMARK_DIR = ./client/bookmark

build: components $(SRC) $(TEMPLATES) $(CSS) bookmark
	component build	

bookmark:
	$(MAKE) -C $(BOOKMARK_DIR) build

lint:
	jshint $(SRC) --config .jshintrc

components: component.json
	component install

%.js: %.html
	component convert $<

clean:
	rm -fr build components $(TEMPLATES) $(CSS)
	$(MAKE) -C $(BOOKMARK_DIR) clean

.PHONY: clean lint bookmark
