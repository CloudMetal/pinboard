
SRC = $(wildcard client/*/*.js)
HTML = $(wildcard client/*/*.html)
TEMPLATES = $(HTML:.html=.js)

build: components $(SRC) $(TEMPLATES)
	component build

lint:
	jshint $(SRC) --config .jshintrc

components: component.json
	component install

%.js: %.html
	component convert $<

clean:
	rm -fr build components $(TEMPLATES)

.PHONY: clean lint bookmark
