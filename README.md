# Formy

### Test with demo dataset

One demo dataset is included in each installation statically.

´´´
/demo/formy.test-config.v1.json
´´´

So you call this:
´´´
https://my-self-hosted-app.com?url=%2Fdemo%2Fformy.test-config.v1.json
´´´

### Encoding the URL parameter

If you use this tool dynamically. Then it is important that the URL parameter "url" is encoded.
This can be done by JavaScript like this.

´´´
const configUrl = 'https://my-self-hosted-server/some/path/formy.test-config.v1.json'
const encodedParameter = encodeURIComponent(configUrl);
const formUrl = `https://formy.io?url=${encodedParameter}`;
´´´
