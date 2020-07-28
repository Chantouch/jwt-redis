# jwt-redis

This library completely repeats the entire functionality of the library [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), with one important addition.
Jwt-redis allows you to store the token label in redis to verify validity.
The absence of a token label in redis makes the token not valid. To destroy the token in **jwt-redis**, there is a destroy method.
This makes it possible to make a token not valid until it expires.
Jwt-redis support [node_redis](https://www.npmjs.com/package/redis) client.

[![Build Status](https://travis-ci.org/Chantouch/jwt-redis.svg?branch=master)](https://travis-ci.org/Chantouch/jwt-redis.svg?branch=master)
[![Latest Version on NPM](https://img.shields.io/npm/v/@chantouchsek/jwt-redis.svg?style=flat-square)](https://npmjs.com/package/@chantouchsek/jwt-redis)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![npm](https://img.shields.io/npm/dt/@chantouchsek/jwt-redis.svg?style=flat-square)](https://npmjs.com/package/@chantouchsek/jwt-redis)
[![npm](https://img.shields.io/npm/dm/@chantouchsek/jwt-redis.svg?style=flat-square)](https://npmjs.com/package/@chantouchsek/jwt-redis)

# Installation

Npm
```npm
npm install @chantouchsek/jwt-redis
```

Yarn
```yarn
yarn add @chantouchsek/jwt-redis
```

# Support

This library is quite fresh, and maybe has bugs. Write me an **email** to *chantouchsek.cs83@gmail.com* and I will
 fix the bug in a few working days.

# Quick start

```js
const redis = require('redis')
const JWTR =  require('@chantouchsek/jwt-redis').default 
//ES6 import JWTR from '@chantouchsek/jwt-redis';
const redisClient = redis.createClient()
const jwtr = new JWTR(redisClient)

const secret = 'secret'
const jti = 'test'
const payload = { jti }

// Create a token
jwtr.sign(payload, secret)
    .then(()=>{
            // Token verification
            return jwtr.verify(token, secret);
    })
    .then(()=>{
            // Destroying the token
            return jwtr.destroy(jti, secret);
    });
```

# Expiration time
You can set the lifetime of the token the same way as in the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) library.
The label in redis is deleted when the token expires.
```js
    // expiresIn - number of seconds through which the token will not be valid
    await jwtr.sign({}, 'secret', {expiresIn: expiresIn})
    // exp - time at which the token will not be valid
    await  jwtr.sign({exp: exp}, secret)
```

# Create jti

For each token, the claims are added **jti**. **Jti** is the identifier of the token.
You can decide for yourself what it will be equal by adding its values to payload.

```js
    const payload = {jti: 'test'}
    await jwtr.sign(payload, secret)
```

If **jti** is not present, then **jti** is generated randomly by the library.

# Destroy token

You can destroy the token through jti.

```js
    await jwtr.destroy(jti)
```


# Native Promise

All methods except the decode method (since it is synchronous) can return a native Promise.

```js
try {
  const token = await jwtr.sign({}, secret)
  console.log(token);
} catch (e) {
  console.log(e)
}
```

# Bluebird

If you want to use **Bluebird**, then after the promiscilation all the methods of the library will be available that return Promise,
Only at the end of each method should you add **Async**.

```js
    const Promise = require('bluebird')
    const Redis = require('ioredis')
    const redis = new Redis()
    const JWTR =  require('@chantouchsek/jwt-redis')
    //ES6 import JWTR from 'jwt-redis';
    const jwtr = new JWTR(redis)
    const jwtrAsync = Promise.promisifyAll(jwtr)

    jwtrAsync
    .signAsync({}, secret)
    .then(function (token) {

    })
    .catch(function (err) {

    })
```

# API

Method for creating a token.
### jwtr.sign(payload, secretOrPrivateKey, [options]): Promise<string> ###

Method for verifying a token
### jwtr.verify<T>(token, secretOrPublicKey, [options]): Promise<T> ###

Method for breaking the token
### jwtr.destroy(jti, [options]): Promise<void> ###

Method for decoding token
### jwt.decode<T>(token, [options]): T ###

jwt-redis fully supports all method options that support the library [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).
Therefore, it is better to read their documentation in addition. But there are several options that are available only in jwt-redis.

Also in the options you can specify a prefix for the redis keys. By default it is *jwt_label:*.

```js
const options = {
    prefix: 'example'
}
const jwtr = new JWTR(redis, options)
```

# TypesScript

This library have typing in module.
