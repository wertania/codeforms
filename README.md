# Formy

Forms are simple. And Forms are needed on almost each website and in many webapps.
So you will find tons of paid tools to create Forms and host them on some cloud provider.
All these tools are great. Don´t get me wrong :-)

But what if you have a project where you are searching for a really free solution?

Here we are! Formy.

## Beta

Formy is in beta at the moment but working.
Documentation and Editor are in Work.

## So easy to use, FREE for commercial and personal use

You can use Formy with own hosting and without the need to have your own server.
The only thing you need is a webhosting (or some other public web storagy) where you can put the Form configuration files.

Each Form/Survey will be a simple and static JSON file. You can put it anywhere in the web.
Then you can use our App Formy.com?url=<put-your-json-url-here> and that´s it!

Self hosting is also no problem if you want to deploy the frontend on your own server.

## Open-Source Form Builder and Survey Builder

With Formy you can create Forms and Survey with multiple pages. You have a long list of possible inputs.
Also you will be able to define simple or complex conditions between the pages.

So with Formy you will have almost all necessary features like other Tools (JotForm, Airtable, Fillout, Tally, Feathery and Co.).
But Formy is really free and Open-Source.

## Depoly self-hosted with Docker

´´´
git clone xxx
docker build -t formy-local .
docker run -p 8080:80 formy-local
´´´

## Read privacy for your users

You want to be sure to don´t have trouble GDPR/DSGVO(Europe)?
Since Formy is a Single-Page-App without Backend the user will never send any data to us or someone else.
Only the action that you define will be fired directly from the User´s browser.

Great, isn´t it?

## Use locally inside your companies network?

Yes! You can do that. If you deploy your config JSON locally in your domain Formy.com will also work.
The only things you need to take care about is that the server for the config have CORS allowed for Formy.com.

## Build on the top of a great Open-Source Stack

I was able to develop Formy because I could use a great Stack of Open Source Software under the hood.

- SPA: Vue3 + Vite + TypeScript
- UI Components: PrimeVue
- Style: PrimeVue Aura Theme

Thanks a lot for this stuff!

### Test with demo dataset

One demo dataset is included in each installation statically.

´´´
// plain
/demo/formy.test-config.v1.json
// encoded
%2Fdemo%2Fformy.test-config.v1.json
´´´

So you call this:
´´´
https://my-self-hosted-app.com?url=%2Fdemo%2Fformy.test-config.v1.json
´´´

### Get the config from some static storage/webhosting/etc.

You can out the JSON config files for a form on all kinds of internet storage as long as it is available for you app.
That mean you have to take care about the CORS policies and you have to check that your server will reply directly with the JSON file.
E.g. the most Cloud-Drive Providers will not work since the public links do not refer directly to an file. The only open a download page.
That will not work with this app.

### Encoding the URL parameter

If you use this tool dynamically. Then it is important that the URL parameter "url" is encoded.
This can be done by JavaScript like this.

´´´
const configUrl = 'https://my-self-hosted-server/some/path/formy.test-config.v1.json'
const encodedParameter = encodeURIComponent(configUrl);
const formUrl = `https://formy.io?url=${encodedParameter}`;
´´´
