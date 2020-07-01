# ts-mocked-deps

Remember how you have to setup a whole bunch of infrastructure locally just to be able to independently work on the front end part of your Jamstack project? If you're tired of doing so, maybe this quick write up on how to replace the infrastructure with code based dependency mocks is just up your alley.

## The idea gist
The basic idea is to have inline code mocks of remote services which will be compiled while running your project locally but will not be bundled with your production code.

## The why

I've been using some derivation of the local setup depicted bellow for a couple of years and always had some problems with it:
 - it added more dependencies to the project
 - it required an extra step during initialization
 - it was prompt to error when the API changed
 - it needed a lot of manual work to adjust API changes
 - I always seem to forget to write some proxy rule in the frontend framework's configuration which required a restart of the local dev server


## The prerequisites

I'm assuming that you are using the following:

- UI with Typescript support
- Webpack as bundler
- HTTP remote API

## Demo setup

To illustrate both mocking techniques I'll be using a demo Vue.js project created with the official CLI. Note that you can use any modern frontend framework with Typescript and Webpack support.

For the remote api part I'll be using [Kitsu's free anime API](https://kitsu.docs.apiary.io/#introduction/json-api) to display some random content.


## A blast from the past
Just a quick overview of what we'll be replacing:
 - local express server
 - local http proxy

 A typical implementation for a REST based mock can be found in the `og-mock` folder. I have used very similar ones for mocking GraphQL based APIs but they generally required even more work to get right so I'll omit using them and their many pitfalls for brevity.