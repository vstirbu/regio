# regio

Minimalist web framework with express-like aspirations, targeted at embedded devices like [Tessel](https://tessel.io) and [Espruino](http://www.espruino.com). Therefore, instead being a mighty express it is just a regional train...

## Motivation

So why another framework?

This framework started as a test suite while investigating how to get [express](http://expressjs.com) running on Tessel.

Because there were simply too many moving parts in slimming down express, I've decided to start with a clean slate and incorporate express middlewares one at a time.

In the process I found out that there is quite a lot of stuff to handle pre 4.x API, disambiguation of function parameters and also too many convenience methods for such a constrained environment as on the devices I was targeting.

So, I've decided to keep the test framework around and use express middleware and components where it does feel appropriate, especially as Espruino is also a target environment.

## Installation

```sh
npm install regio
```

## Tests

Currently the test run in node but the plan is to move them to colony.

```sh
npm test
```
