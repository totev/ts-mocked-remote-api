# ts-mocked-remote-api

## Code based remote API mocking with Typescript and Webpack

![Node.js CI](https://github.com/totev/ts-mocked-remote-api/workflows/Node.js%20CI/badge.svg)

## Introduction

Remember how you have to set up a whole bunch of infrastructure locally just to be able to independently work on the frontend part of your Jamstack project? If you're tired of doing so, maybe this short write-up on how to replace the infrastructure with code based dependency mocks is just up your alley.

## In a nutshell

The basic idea is to have inline mocks of remote services in your frontend code which will be compiled while running your project locally but will not be bundled with your production code. The separation is achieved via additional Typescript path mappings and module resolving in Webpack.

## The why

In the past I've typically set up a local server to mock my remote API, but have always had some problems with that approach:

- it added more dependencies to the project
- it required an extra step during initialization
- it was prone to error when the API changed
- it needed a lot of manual work to adjust to API changes
- I always seemed to forget to write some proxy rule in the frontend framework's configuration which required a restart of the local dev server

Frontend-based code mocks, on the other hand, offer a number of benefits to speed up development:

- compile time errors resulting from unreflected API changes
- fine grained control over every aspects of the mocks
- automatic code rebuild
- the mocks are directly available in the tests - no need to do custom remote API mocking/stubbing

That being said, the old setup can imho still be very helpful in some circumstances, especially for projects where Typescript and Webpack are not available.

## The prerequisites

I'm assuming that you are using the following:

- UI with Typescript support
- Webpack as bundler
- HTTP remote REST API

## Demo setup

To illustrate both mocking techniques I'll be using a demo Vue.js project created with the official CLI. Note that you can use any modern frontend framework with Typescript and Webpack support.

The demo project is available in [this github repository](https://github.com/totev/ts-mocked-remote-api).

For the remote api part I'll be using [Kitsu's free anime API](https://kitsu.docs.apiary.io/#introduction/json-api) to display a random anime content.

The resulting "application" can be found under https://ts-mocked-remote-api.codecentric.rocks/.

## A blast from the (not so distant) past

A typical implementation for a REST based remote API mock can be found in the `express-mock` folder in the repository. I have used very similar ones for mocking GraphQL based APIs but they generally required even more work to get right so I'll omit describing them and their many pitfalls for brevity.

Just a quick overview of what's needed for this to work:

- local express server
- local HTTP proxy

The idea here being that you start the local express server which will mimic the behavior of your backend server. The HTTP proxy will be the router between your local development server for the frontend and the mocking backend server.

To try it out head out to 'express-mock' and run 'npm run mock:api' which will fire up the express server listening on port 4100 and await to serve mock data. A quick check with a command like `curl "localhost:4100/trending/anime?limit=2"` should show if the mocked server is working.

Now all that's left is a HTTP proxy rerouting the requests from the frontend development server to the backend mock. Usually the rule looks something like this: `localhost:8080/remote-api -> localhost:4100`. As this example is using Vue.js with the Vue CLI the way to wire this is via a dev proxy - as described [in the official documentation](https://cli.vuejs.org/config/#devserver-proxy).

The HTTP proxy configuration for the example used here looks like this:

```js
//@file gists/vue.config.js
// <script src="https://gist.github.com/totev/8298858b282d652c6963832458b4b6fe.js"></script>
module.exports = {
  devServer: {
    proxy: {
      "/anime-api": {
        pathRewrite: {
          "^/anime-api/": "/", // remove prefix
        },
        target: "http://localhost:4100/",
        ws: true,
        changeOrigin: true,
        logLevel: "debug",
      },
    },
  },
};
```

And that's it - now we should be able to develop the frontend part of our Jamstack app independent from the real backend. Oh wait, this setup was just to show how the process used to look like - the interesting part is yet to come :(

## Mocking with Typescript and Webpack

You've read the gist of the idea - now it's time to talk about the implementation. Lets divide it into a 4 step process:

1.  implement mock services
1.  add path mapping in Typescript's compiler options
1.  setup Webpack to omit the mocks from the production build
1.  (optional) setup test harness with the custom alias/path mapping

### Show me the mocked service

Coding the mocked services is pretty much straightforward, since there is an interface we can implement. I'll be using [faker.js](https://github.com/Marak/Faker.js#readme) for producing semantically and syntactically correct fake data. Also, just for fun, there is a random delay in the response. You can go wild and add exceptions, faulty data and so on to appear randomly in order to make it feel more like working with a remote API.

```ts
//@file gists/anime.mock-service.ts
// <script src="https://gist.github.com/totev/f46c0d166ef28ed3d9d04a2e325b9f60.js"></script>
import faker from "faker";
import { Anime } from "../../../src/models/anime";
import { RemoteAnimeService } from "../../../src/services/remote-api/remote.service";

function createAnimeMock(): Anime {
  return {
    id: faker.random.uuid(),
    attributes: {
      //...
    },
  };
}

export class MockAnimeService implements RemoteAnimeService {
  async fetchTrending(): Promise<any> {
    const result = createAnimeMock();
    return new Promise((resolve) => {
      // why not add a delay to make it more realistic
      setTimeout(() => {
        resolve(result);
      }, faker.random.number(1500));
    });
  }
}
```

### Configuring the Typescript compiler

A new path mapping is needed in the Typescript configuration in order to be able to pinpoint which imports are to be replaced later on in the bundling phase by Webpack.

```json
//@file gists/tsconfig.partial.json
// <script src="https://gist.github.com/totev/f8a443c1aa03f055e76cc2a14204a4bc.js"></script>
{
  "compilerOptions": {
    "paths": {
      "@remote-api/*": ["src/services/remote-api/*"]
    }
  }
}
```

A service import will then look like this:

```ts
//@file gists/service.import.ts
// <script src="https://gist.github.com/totev/dec33946432e615e13966548b9d4c0be.js"></script>
import { AnimeService } from "@remote-api/index";
```

Also note, that I am using a facade for convenient class/interface exporting.

### Configuring Webpack

The last step is to configure [module resolving in webpack](https://webpack.js.org/configuration/resolve/#resolvealias). The idea behind it being to explicitly specify the location of the imported code modules based on the current environment.

```js
//@file gists/vue.webpack-config.js
// <script src="https://gist.github.com/totev/d1ba39c8b1ac0ac2f5be29a5a41a307c.js"></script>
const path = require("path");

module.exports = {
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.resolve.alias.set(
        "@remote-api",
        path.resolve(__dirname, "src/services/remote-api/")
      );
    } else {
      config.resolve.alias.set(
        "@remote-api",
        path.resolve(__dirname, "mock/services/remote-api/")
      );
    }
  },
};
```

### Configuring the test harness

Last but not least the test harness should be updated to be able to follow the custom path mapping as defined in the `tsconfig.json` file. I opted for using [jest](https://jestjs.io/) so the module mapper should only be updated. Everything else can be inherited from the base configuration:

```js
//@file jest.config.js
// <script src="https://gist.github.com/totev/308abda0d9b3a8ea7367af01a1667725.js"></script>
const deepmerge = require("deepmerge");
const defaultPreset = require("@vue/cli-plugin-unit-jest/presets/typescript/jest-preset");

module.exports = deepmerge(defaultPreset, {
  moduleNameMapper: {
    "^@remote-api/(.*)$": "<rootDir>/mock/services/remote-api/$1",
  },
});
```

With the above _jest_ configuration, importing the remote services will always include the mocked version:

```ts
//@file gists/remote.service.spec.ts
// <script src="https://gist.github.com/totev/3f465547e5096aa8e2fdf4943124aaff.js"></script>
import { AnimeService } from "@remote-api/index";

describe("RemoteAnimeServiceSpec", () => {
  it("does not trigger remote service", async () => {
    const animeService = new AnimeService();
    const result = await animeService.fetchTrending();
    expect(result.id).toBeTruthy();
    expect(result.attributes.status).toBe("mocked finished");
  });
});
```

And that's it - now your project will use the mocks implementation of the remote service when working locally and the real one in the production build! But don't take my word for it - check out the whole example in [this github repository](https://github.com/totev/ts-mocked-remote-api).
