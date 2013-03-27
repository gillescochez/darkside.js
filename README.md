darkside.js
===========

darkside is a singleton class that facilitate the manipulation of Cookies, ence the `clever`.. erm.. name...

All cookie data is stored internally and updated everytime keys are added/removed or when a request is made and the cached cookie string is different than the current one.

When the JSON object is available it's possible to store values of any types as JSON.stringify and JSON.parse will be used.
See https://github.com/component/json-fallback for older browsers if you have to support them.

## Basic API

### write(key, value[,options=Object])

Write a new key/value pair in document.cookie

#### Options object

Overwrite the defaults configuration for that write call

* end
* path
* domain
* secure

### read(key);

return the value associated with the given key

### exists(key);

return true/false depending if the key exists/not exists

### equal(key, value);

return true/false if the value associated with the key in cookie is equal/not equal to the value given

### remove(key[,path=String)

remove an individual key

### removeAll([path=String])

remove all cookies

### keys()

return an array of all the keys found in document.cookie

### values()

return an array of all the values found in document.cookie

### pairs()

return object with key/value pairs in document.cookie

### cacheLife

time in milliseconds after which the cache will be considered invalid and ence initiate a refresh on next request

## Advanced API

### refresh()

regenerate the cache using the current value of document.cookie

### refreshIf()

regenerate the cache only if the cache is obsolete.

### set

document.cookie setter

### get

document.cookie getter

## Defaults

Defaults value to be use for options not provided on write calls. All disabled by default.

* end
* path
* domain
* secure

## Cache

Cache structure and types

* darkside.cache.cookie (String)
* darkside.cache.keys (Array)
* darkside.cache.values (Array)
* darkside.cache.pairs (Object)

## Usage

```javascript

darkside.removeAll('/demos/darkside');
darkside.write('foo', 'foo');

darkside.write('array', ['a','b']);
darkside.write('object', {
	a:'a',
	b:'b'
});


var pairs = darkside.pairs();
console.log(pairs, darkside);

```

## Credits

Started from the MDN approach and ended up with some of cookies and it's great JSON usage.

* https://code.google.com/p/cookies/
* https://developer.mozilla.org/en-US/docs/DOM/document.cookie