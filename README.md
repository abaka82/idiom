#IDIOM DB

IDIOM application is based on PEAN.JS/MEAN.JS which is a full-stack JavaScript open-source solution, which provides a solid starting point for MySQL, [Node.js](http://www.nodejs.org/), [Express](http://expressjs.com/), and [AngularJS](http://angularjs.org/) based applications. The idea is to solve the common issues with connecting those frameworks, build a robust framework to support daily development needs, and help developers use better practices while working with popular JavaScript components.


## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
  * Node v5 IS NOT SUPPORTED AT THIS TIME! 
* MySQL - [Download & Install MySQL](https://www.mysql.com).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process. Make sure you've installed Node.js and npm first, then install grunt globally using npm:

```bash
$ npm install -g grunt-cli
```


## Downloading PEAN.JS
There are several ways you can get the PEAN.JS boilerplate:


## Quick Install
Once you've downloaded the boilerplate and installed all the prerequisites, you're just a few steps away from starting your application.

The first thing you should do is install the Node.js dependencies. In the application folder, run this from the command-line:

```bash
$ npm install
```



## Running Your Application
1. The first thing you will need to do is supply Idiom MySQL schema by importing from idiom.sql.

2. Then you will need to do is supply your MySQL credentials. To do this, open 'config/env/development.js' and edit as required:

  db: {
    options: {
      logging: process.env.DB_LOGGING === 'true' ? console.log : false,
      host: '127.0.0.1',                   --> change to your host
      port: process.env.DB_PORT || '3306',
      database: 'idiom',                   --> change to your db name
      password: '',                        --> change to your db password
      username: 'root'                     --> change to your db username
    },

3. [Optional] Change port number in 'config/env/default.js':
  port: process.env.PORT || 3000,          --> change to your prefereable port

4. Now just run your application using Grunt. 

In the application folder, run this from the command-line:

```
$ grunt
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! Your application should be running.

