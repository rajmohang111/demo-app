PACKAGE_NAME  = io
VERSION       = 1.0

NODEUNIT      = ./node_modules/.bin/nodeunit
JSHINT        = ./node_modules/.bin/jshint
GRUNT         = ./node_modules/.bin/grunt
SRCDIR        = io
SOURCES      := $(shell find $(SRCDIR) -type f -name '*.js' -not -name '*.test.js')
TESTS        := $(shell find $(SRCDIR)/test -type f -name '*.test.js')
BUILDDIR      = build
BUILD_NUMBER ?= 0000INVALID
NODE_ENV     ?= local

prefix = /appl
bindir = ${prefix}/${PACKAGE_NAME}

$(shell if [ ! -d $(BUILDDIR) ]; then mkdir $(BUILDDIR); fi)

version: package.json

package.json: package.json.m4
	m4 -D__BUILD__=$(BUILD_NUMBER) $^ > $@

modules: version
	npm install

install:
	install -d $(DESTDIR)$(bindir)
	install -m 644 package.json $(DESTDIR)$(bindir)
	install -m 755 io.js $(DESTDIR)$(bindir)
	find $(SRCDIR) -type d -printf %P\\0 | xargs -0r -I__ install -d $(DESTDIR)$(bindir)/$(SRCDIR)/__
	find $(SRCDIR) -type f -printf %P\\0 | xargs -0r -I__ install -m 644 $(SRCDIR)/__ $(DESTDIR)$(bindir)/$(SRCDIR)/__
	find node_modules -type d -printf %P\\0 | xargs -0r -I__ install -d $(DESTDIR)$(bindir)/node_modules/__
	find node_modules -type f -printf %P\\0 | xargs -0r -I__ install -m 644 node_modules/__ $(DESTDIR)$(bindir)/node_modules/__

uninstall:
	rm -rf $(DESTDIR)$(bindir)

test: modules
	$(NODEUNIT) $(TESTS)

junit.xml: modules
	-$(NODEUNIT) --reporter junit --output $(BUILDDIR)/$@ $(TESTS)

jshint: modules
	$(JSHINT) $(SRCDIR) --config .jshintrc

jshint.xml: modules
	-$(JSHINT) $(SRCDIR) --config .jshintrc --jslint-reporter > $(BUILDDIR)/$@

grunt: modules
	$(GRUNT) --force  --verbose

clean:
	rm -f package.json *.rpm npm-debug.log
	rm -rf $(BUILDDIR)

distclean: clean
	rm -rf node_modules

minify:
	rm -rf io/public/build
	node node_modules/.bin/r.js -o io/public/js/app.build.js

build:
	make minify
	make build-rpm

build-rpm:
	npm remove grunt
	npm remove grunt-contrib-jshint
	npm remove grunt-contrib-connect
	npm remove grunt-contrib-clean
	npm remove grunt-contrib-cssmin
	npm remove grunt-contrib-requirejs
	npm remove grunt-shell
	npm remove grunt-contrib-jasmine
	npm remove grunt-template-jasmine-requirejs
	make install prefix=/appl DESTDIR=$(BUILDDIR)
	fpm -s dir -t rpm -C $(BUILDDIR) \
	-n $(PACKAGE_NAME)-$(NODE_ENV) -v $(VERSION).$(BUILD_NUMBER) -a noarch \
	--description "GE I/O" \
	-d "nodejs >= 0.8.18" \
	-x .svn appl/$(PACKAGE_NAME)
	make uninstall prefix=/appl DESTDIR=$(BUILDDIR)

publish-rpm:
	mv *.noarch.rpm /data/repo/rpm/EL/5/noarch/RPMS/

.PHONY: clean distclean install package.json build build-rpm test jshint junit.xml jshint.xml grunt
