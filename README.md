# alon:lag-methods
[![Build Status](https://secure.travis-ci.org/MsaterAM/meteor-lag-methods.png?branch=master)](https://travis-ci.org/MsaterAM/meteor-lag-methods)

A configurable dev-only package that adds lag to your Meteor methods.


## Installation

```sh
$ meteor add alon:lag-methods
```

## Indroduction
A configurable dev-only package that adds delay to your Meteor methods.

Since development is often done on a powerful local machine without much load, the method call round-trip is often very quick. Any UI changes that reflect the intermediate state often appear as a short flash of content before the view renders with the new data or state.

This behavior is defferent from the one that will be experienced by users of the production server, and therefore developers sometimes resort to quick and dirty ways for adding delay to their method calls (by calling `Meteor._sleepForMs()` - or dirtier solutions - directly in method code). If left alone and not cleaned up, it could eventually cause undesired delay of the deployed application.

This package is intended to provide a cleaner alternative to those dirty fixes.

The package adds delay to methods on the server only. Different delays can be configured for specific methods and the default delay can also be set (it is 2000ms by default).


## Usage
The package can be configured via a settings file or by calling its API configuration methods.
### settings file
This is probably the cleanest way to use the package.

Create a json file (e.g, _config/development-settings.json_, but you can put it anywhere) that contains a top-level property called `lagMethods`.

```json
{
  "lagMethods": {
    "defaultDelay": 1000,
    "methods": {
      "foo": 3000,
      "bar": 5000
    }
  }
}
```
Then, run Meteor using:
```sh
$ meteor run --settings config/development-settings.json
```
The settings will be applied and will have the following effects:
- calls to `foo` will be delayed by 3 seconds.
- calls to `bar` will be delayed by 5 seconds.
- calls to any other method, such as `baz`, will be delayed by the default value, which is no set to 1 second.

### in code or via the interactive shell
The delays can be set dynamically by calling the configuration functions available on the server.

Since this package is a `devOnly` package, it does not create any top-level global variable, so the configuration object is available in the `Package` global object:
```js
Package['alon:lag-methods'].LagMethods
```
It has the following methods:


#### setDefaultDelay(delay)

Set the default delay for methods.

**Parameters**

**delay**: `Number`, the default delay to set (in ms)

**Returns**: `Number`, the previous delay value

**Example**:
```js
//sets the default delay to 1500 ms
Package['alon:lag-methods'].LagMethods.setDefaultDelay(1500);
```


#### setDelaysForMethods(delays, replace)

Set the delays for specific methods.
Specify the delays in an object which keys are method names:

**Parameters**

**delays**: `Object`, a key-value collection of method names and delays

**replace**: `Boolean`, whether or not to replace currently set delays


**Example**:
```js
Package['alon:lag-methods'].LagMethods.setDelaysForMethods({
  'baz': 1500,
  ...
});
```

## Running tests

```sh
$ git clone https://github.com/MasterAM/meteor-lag-methods.git
$ cd meteor-lag-methods
$ meteor test-packages ./
```
and pointing your browser to the relevant URL (usually `http://localhost:3000`).
