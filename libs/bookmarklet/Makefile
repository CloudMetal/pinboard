
SRC = $(wildcard ./client/**/*.js)
HTML = $(wildcard ./client/**/*.html)
CSS = $(wildcard ./client/**/*.css)
TEMPLATES = $(HTML:.html=.js)

BUILD_DIR = ../pinboard/build
BUILD_NAME = bookmarklet
BUILD_FILE_JS = $(addprefix $(BUILD_DIR)/, $(BUILD_NAME).js)
BUILD_FILE_CSS = $(addprefix $(BUILD_DIR)/, $(BUILD_NAME).css)

TMP_DIR = tmp
BEGIN = ";(function(){\n"
END = '\n\nrequire("boot");\n})();'
BEGIN_FILE = $(addprefix $(TMP_DIR)/, begin.js)
END_FILE = $(addprefix $(TMP_DIR)/, end.js)
TMP_BUILD_FILE = $(addprefix $(TMP_DIR)/, $(BUILD_NAME).js)

build: components $(TMP_DIR) $(TEMPLATES) $(CSS)	
	component build -o $(BUILD_DIR) -n $(BUILD_NAME)
	@cat $(BEGIN_FILE) $(BUILD_FILE_JS) $(END_FILE) > $(TMP_BUILD_FILE)
	@cp $(TMP_BUILD_FILE) $(BUILD_FILE_JS)

$(TMP_DIR):
	@mkdir -p $(TMP_DIR)
	@echo $(BEGIN) > $(BEGIN_FILE)
	@echo $(END) > $(END_FILE)

components: component.json
	component install

%.js: %.html
	component convert $<

clean:
	rm -fr components $(TMP_DIR) $(TEMPLATES) $(BUILD_FILE_JS) $(BUILD_FILE_CSS)

.PHONY: clean
