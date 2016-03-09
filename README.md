# Kiss My Error

A standard errors tracking for express/non-express projects that automatically
repots failures to `sentry` and renders an appropriate error message. `NODE_ENV`
aware.

## Basic usage

```js
import express from "express";
import errors from "kiss-my-error";
import routes from "./routes";

const app = express();

app.use(routes);

app.use(errors.middleware); // <- must be the last one!

export default app;
```

![](https://c1.staticflickr.com/5/4105/4956423653_0f1f14ec6a.jpg)


## Production usage

if `NODE_ENV=production` is exported it will automatically hide all the error
details and spit out a basic error page.

if `SENTRY_DSN` is exported then this thing will automatically report all the
errors to the specified sentry acc/project.

## Custom Error Page

By default this package comes with a vanilla 500 error page template for production
use. A very basic one. If you want a custom 500 error page for a specific project,
just create a `public/500.html` file in the project. This module will automatically
pick it up.
