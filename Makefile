
EMAIL=$(shell jq .email credentials.json)
AUTH_KEY=$(shell jq .auth_key credentials.json)
ZONE_ID=$(shell jq .zone_id credentials.json)
CURL=curl -X PUT "https://api.cloudflare.com/client/v4/zones/$(ZONE_ID)/workers/script" -H "X-Auth-Email:$(EMAIL)" -H "X-Auth-Key:$(AUTH_KEY)"

.PHONY: all
all: upload

.DELETE_ON_ERROR: dist/input.js
dist/input.js: src/worker.js vendors/zxcvbn.js build.sed
	sed -f build.sed src/worker.js > dist/input.js

.PHONY: upload
upload: dist/input.js
	$(CURL) -H 'Content-Type: application/javascript' --data-binary "@$<"
