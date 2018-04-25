# ngx-forge

[![Build Status](https://ci.centos.org/buildStatus/icon?job=devtools-ngx-forge-npm-publish-build-master)](https://ci.centos.org/view/Devtools/job/devtools-ngx-forge-npm-publish-build-master/) 
[![Build Status](http://jenkins.cd.test.fabric8.io/job/fabric8-launchpad/job/ngx-forge/job/master/)](http://jenkins.cd.test.fabric8.io/job/fabric8-ui/job/ngx-forge/job/master/) 
[![npm version](https://badge.fury.io/js/ngx-forge.svg)](https://badge.fury.io/js/ngx-forge)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) 

A collection of Angular services and components to work with [Forge Wizard UI](http://forge.jboss.org/).


You can see how it is used in:
* [fabric8-ui](https://github.com/fabric8io/fabric8-ui) application - deployed https://openshift.io 
* [launchpad-frontend](https://github.com/fabric8-launchpad/launchpad-frontend) application - deployed https://launch.openshift.io

All components shared a common object model for the Input. 
ForgeService provide common REST endpoints like `next`, `validate`, `execute` to work with your Swarm backends, see:
* [launchpad backend](https://github.com/fabric8-launch/launchpad-backend) and its [launchpad-addon](https://github.com/fabric8-launch/launchpad-addon).
* [fabric8 backend](https://github.com/fabric8io/generator-backend) and its [fabrci8-generator add-on ](https://github.com/fabric8io/fabric8-generator).

## Getting started:

This library does not run on it's own. It must be imported. 

`npm install ngx-forge`

  
## Building it 
 
#### Pre-requisites
* node 8.3.0
* npm 5.3.0

#### Install the dependencies:
 
 `npm install`
 
#### If you need to update the dependencies you can reinstall:
 
 `npm run reinstall`
 
#### Run the tests:
 
 `npm test`
 
#### Build the library:
 
 `npm run build`
 
## Library Build

### Production

To build ngx-forge as a npm library, use:

```
npm run build   
npm run bundle-webpack
npm publish dist
```

### Development

To build ngx-forge as an npm library and embed it into a webapp such as
fabric8-ui, you should:

1. Run `npm run watch:library` in this directory. This will build ngx-forge as
a library and then set up a watch task to rebuild any ts, html and less files you
change.
2. In the webapp into which you are embedding, run `npm link <path to ngx-forge>/dist-watch`.
This will create a symlink from `node_modules/ngx-forge` to the `dist-watch` directory
and install that symlinked node module into your webapp.
3. Run your webapp in development mode, making sure you have a watch on `node_modules/ngx-forge`
enabled. To do this using a typical Angular Webpack setup, such as the one based on Angular Class,
just run `npm start. You will have access to both JS sourcemaps and SASS sourcemaps if your webapp
is properly setup.

## Dependencies

Our dependencies (`--dev` included) are managed but npm-shrinkwrap.
When updating versions, make sure you update both `package.json` and `npm-shrinkwrap.json`.

To generate a new shrinkwrap file:
```
npm install shrinkwrap
npm shrinkwrap --dev
```
Links:

* [Updating a package when you're using npm shrinkwrap](https://gist.github.com/alanhogan/a32889830384f4e190fa)
* with npm3, you may need to manually update `node_module/your_dependency/package.json` to remove `peerDependecies` casuing shrinkwrap file hgenration to fail.
* There is a demo of the [wizard available on OpenShift](http://launcher-ngx-launcher.6923.rh-us-east-1.openshiftapps.com/#/) that is updated with each PR.
