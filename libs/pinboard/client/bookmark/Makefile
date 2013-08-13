
SRC = $(wildcard *.js)
HTML = $(wildcard *.html)
TEMPLATES = $(HTML:.html=.js)

BUILD_DIR = ../../build
BUILD_NAME = bookmark
BUILD_FILE = $(addprefix $(BUILD_DIR)/, $(BUILD_NAME).js)

TMP_DIR = tmp
BEGIN = ";(function(){\n"
END = '\n\nrequire("bookmark");\n})();'
BEGIN_FILE = $(addprefix $(TMP_DIR)/, begin.js)
END_FILE = $(addprefix $(TMP_DIR)/, end.js)
TMP_BUILD_FILE = $(addprefix $(TMP_DIR)/, $(BUILD_NAME).js)

build: components tmp $(TEMPLATES) $(CSS)	
	component build -o $(BUILD_DIR) -n $(BUILD_NAME)
	@cat $(BEGIN_FILE) $(BUILD_FILE) $(END_FILE) > $(TMP_BUILD_FILE)
	@cp $(TMP_BUILD_FILE) $(BUILD_FILE)

tmp:
	@mkdir -p $(TMP_DIR)
	@echo $(BEGIN) > $(BEGIN_FILE)
	@echo $(END) > $(END_FILE)

components: component.json
	component install

%.js: %.html
	component convert $<

clean: rmtmp
	rm -fr components $(TMP_DIR) $(TEMPLATES) $(CSS) $(BUILD_DIR)/bookmark.js ../../build/bookmark.css

.PHONY: clean lint
