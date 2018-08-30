# ngx-launcher

[![Build Status](https://semaphoreci.com/api/v1/fabric8-launcher/ngx-launcher/branches/master/shields_badge.svg)](https://semaphoreci.com/fabric8-launcher/ngx-launcher)
[![npm version](https://badge.fury.io/js/ngx-launcher.svg)](https://badge.fury.io/js/ngx-launcher)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A collection of Angular services and components to work with [Forge Wizard UI](http://forge.jboss.org/) to provide an easy getting started experience with OpenShift.


You can see how it is used in:
* [fabric8-ui](https://github.com/fabric8io/fabric8-ui) application - deployed https://openshift.io
* [launchpad-frontend](https://github.com/fabric8-launchpad/launchpad-frontend) application - deployed https://launch.openshift.io

All components shared a common object model for the Input.
ForgeService provide common REST endpoints like `next`, `validate`, `execute` to work with your Swarm backends, see:
* [launchpad backend](https://github.com/fabric8-launch/launchpad-backend) and its [launchpad-addon](https://github.com/fabric8-launch/launchpad-addon).
* [fabric8 backend](https://github.com/fabric8io/generator-backend) and its [fabrci8-generator add-on ](https://github.com/fabric8io/fabric8-generator).

## Getting started:

This library does not run on it's own. It must be imported.

`npm install ngx-launcher`


## Building it

#### Pre-requisites
* node v8.9.1+ (required by anuglar-cli 6+)
* npm 5.5.1

This angular library is built using [angular-cli](https://github.com/angular/angular-cli/wiki)'s workspace.
The main application is the demo app. The library source is under [/projects/ngx-launcher](/projects/ngx-launcher)

#### Install the dependencies:

 ```
 npm install
 ```

#### If you need to update the dependencies you can reinstall:

 ```
 npm run clean
 npm install
 ```

#### Run the tests:

 ```
 npm test
 ```
> NOTE: to run the library test in watch mode: `npm run test:lib:dev`

#### Build library and demo app:
 ```
 npm run build
 ```

#### Run the demo

```shell
npm install
npm run build
npm start
```
Open your browser on http://localhost:4200/

## Release

* pre-requisites

> Note: semantic release are done via semaphoreci using `semantic-release`

