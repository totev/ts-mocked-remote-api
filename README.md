# ts-mocked-deps

Remember how you have to setup a whole bunch of infrastructure locally just to be able to independently work on the frontend part of your Jamstack project? If you're tired of doing so, maybe this short write up on how to replace the infrastructure with code based dependency mocks is just up your alley.

## The idea gist
The basic idea is to have inline code mocks of remote services which will be compiled while running your project locally but will not be bundled with your production code.

## The why

I've been using some derivation of the local setup depicted bellow for a couple of years and always had some problems with it:
 - it added more dependencies to the project
 - it required an extra step during initialization
 - it was prompt to error when the API changed
 - it needed a lot of manual work to adjust to API changes
 - I always seem to forget to write some proxy rule in the frontend framework's configuration which required a restart of the local dev server

 That being said, the setup is imho still very helpful and works well especially for projects where Typescript and Webpack are not available.


## The prerequisites

I'm assuming that you are using the following:

- UI with Typescript support
- Webpack as bundler
- HTTP remote API

## Demo setup

To illustrate both mocking techniques I'll be using a demo Vue.js project created with the official CLI. Note that you can use any modern frontend framework with Typescript and Webpack support.

For the remote api part I'll be using [Kitsu's free anime API](https://kitsu.docs.apiary.io/#introduction/json-api) to display a random anime content.

Also I'm assuming, that you have a reverse proxy running on production your web server to rewrite remote api calls and not run into any CORS issues. In this case it should have a rewrite rule something like `/remote-api -> https://kitsu.docs.apiary.io/#introduction/json-api`



## A blast from the (recent) past
 A typical implementation for a REST based mock can be found in the `og-mock` folder. I have used very similar ones for mocking GraphQL based APIs but they generally required even more work to get right so I'll omit describing them and their many pitfalls for brevity.

 Just a quick overview of what's needed for this to work:
 - local express server
 - local HTTP proxy

The idea here being that you start the local express server which will mimic your backend server. The HTTP proxy will be the router between your local development server for the frontend and the mocking backend server.

To try it out head out to 'og-mock' and run 'npm run mock:api' which will fire up the express server listening on port 4100 and await to serve mock data. A quick check with something like `curl "localhost:4100/trending/anime?limit=2"` should show if the mocked server is working.

Now all that's left is a HTTP proxy rerouting the requests from the frontend development server to the backend mock. Usually the rule looks something like this: `localhost:8080/remote-api -> localhost:4100`. As this example is using Vue.js with the Vue CLI the way to wire this dev proxy is described [in the official documentation](https://cli.vuejs.org/config/#devserver-proxy).

The HTTP proxy configuration for the example used here looks like this:
##LINK -> gists/vue.config.js## 

And that's it now we should be able to develop the frontend part of our Jamstack app independent from the backend. Oh wait, this setup was just to show how the process used to look like - the interesting part is yet to come :(