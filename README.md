# User Profile extension module for Aries Framework JavaScript


> **Deprecation notice:** Development has been moved to https://github.com/2060-io/credo-ts-didcomm-ext. New NPM package name is @2060.io/credo-ts-didcomm-user-profile

This module is used to provide an Aries Agent built with Aries Framework JavaScript means to manage [User Profile protocol](https://github.com/2060-io/aries-rfcs/tree/feature/user-profile/features/xxxx-user-profile).

It's conceived as an extension module for Aries Framework JavaScript which can be injected to an existing agent instance:

```ts
import { UserProfileModule } from 'credo-ts-user-profile'

const agent = new Agent({
  config: {
    /* agent config */
  },
  dependencies,
  modules: { userProfile: new UserProfileModule() },
})
```

Once instantiated, media module API can be accessed under `agent.modules.userProfile` namespace

## Usage

> **TODO**
