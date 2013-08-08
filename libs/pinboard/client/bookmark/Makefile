
SRC = $(wildcard *.js)
HTML = $(wildcard *.html)
TEMPLATES = $(HTML:.html=.js)

BUILD_DIR = ../../build
NAME = bookmark

build: components $(SRC) $(TEMPLATES) $(CSS)
	component build -s $(NAME) -o $(BUILD_DIR) -n $(NAME)

components: component.json
	component install

%.js: %.html
	component convert $<

clean:
	rm -fr components $(TEMPLATES) $(CSS) $(BUILD_DIR)/bookmark.js ../../build/bookmark.css

.PHONY: clean lint
