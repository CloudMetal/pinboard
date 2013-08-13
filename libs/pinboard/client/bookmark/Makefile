
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

tmp: buildtmp wrapbuild mvbuild

mktmp:
	@mkdir -p $(TMP_DIR)

mkbegin: mktmp
	@echo $(BEGIN) > $(BEGIN_FILE)

mkend: mktmp
	@echo $(END) > $(END_FILE)

buildtmp: $(SRC)
	component build -o $(BUILD_DIR) -n $(BUILD_NAME)

wrapbuild: mktmp mkbegin mkend buildtmp
	@cat $(BEGIN_FILE) $(BUILD_FILE) $(END_FILE) > $(TMP_BUILD_FILE)

mvbuild: wrapbuild
	@cp $(TMP_BUILD_FILE) $(BUILD_FILE)

rmtmp:
	@rm -rf $(TMP_DIR)

components: component.json
	component install

%.js: %.html
	component convert $<

clean: rmtmp
	rm -fr components $(TEMPLATES) $(CSS) $(BUILD_DIR)/bookmark.js ../../build/bookmark.css

.PHONY: clean lint tmp mvbuild rmtmp
