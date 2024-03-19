<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <p class="text-base font-semibold leading-7 text-indigo-600">
          Create and deploy Forms and Surveys
        </p>
        <h1
          class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
        >
          CodeForms - The free and Open-Source Form/Survey Tool
        </h1>
        <div
          class="mt-10 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-700 lg:max-w-none lg:grid-cols-2"
        >
          <div>
            <p>
              Forms are simple. And Forms are needed on almost each website and
              in many webapps. So you will find tons of paid tools to create
              Forms and host them on some cloud provider. All these tools are
              great. Don´t get me wrong 😀 But what if you have a project where
              you are searching for a really free solution? Here we are!
            </p>
          </div>
          <div>
            <p>
              With CodeForms you can create Forms and Survey with multiple
              pages. You have a long list of possible inputs. Also you will be
              able to define simple or complex conditions between the pages. So
              with CodeForms you will have almost all necessary features like
              other Tools (JotForm, Airtable, Fillout, Tally, Feathery and Co.).
              But CodeForms is really free and Open-Source.
            </p>
          </div>
        </div>

        <div class="mt-10 flex">
          <a
            href="https://app.codeforms.org"
            class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Get started
          </a>
        </div>
      </div>
    </div>
    <div class="relative overflow-hidden pt-16 lg:pt-20">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <img
          class="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
          src="/assets/codeforms_demo.gif"
          alt=""
        />
        <div class="relative" aria-hidden="true">
          <div
            class="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]"
          />
        </div>
      </div>
    </div>

    <div
      class="mt-10 grid max-w-xl grid-cols-1 gap-8 text-base leading-7 text-gray-700 lg:max-w-none lg:grid-cols-2"
    >
      <div>
        <p>
          You can use CodeForms with own hosting. The only thing you need is a
          webhosting (or some other public web storage) where you can put the
          Form configuration files and deploy the static web app. Each
          Form/Survey will be a simple and static JSON file. You can put it
          anywhere in the web. Then you can use our App
          CodeForms.org?url=>>put-your-json-url-here<< and that´s it! Full Self
          hosting is also no problem if you want to deploy the frontend on your
          own server. Simply use the docker container.
        </p>
      </div>
      <div>
        <p>
          You want to be sure to don´t have trouble GDPR/DSGVO(Europe)? Since
          CodeForms is a Single-Page-App without Backend the user will never
          send any data to us or someone else. Only the action that you define
          will be fired directly from the User´s browser. Great, isn´t it.
        </p>
      </div>
    </div>
  </div>
</template>
