'use strict';

/**
 * @license
 * Copyright 2016 Leif Olsen. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A simple javascript utility for conditionally joining strings together (using map-reduce).
 * The function takes a delimiter string and any number of arguments which can be a string or object.
 * Inspired by (but not copied from) JedWatson/classnames, https://github.com/JedWatson/classnames
 * @param delimiter delimiter to separate joined strings
 * @param  strings the strings to join
 * @return {String} the joined string
 * @example
 * // Returns 'foo, bar, baz, quux'
 * joinStrings(', ', 'foo', { bar: true, duck: false }, 'baz', { quux: true });
 * @example see the tests for mpre examples
 */
const joinStrings = (delimiter=' ', ...strings) => {

  const isString = str => str != null && typeof str === 'string';

  const reduceString = (result, str) => isString(str)
    ? result ? `${result}${delimiter}${str}` : str
    : Object.keys(str)
      .filter( key => str[key] )
      .reduce( (result, key) => result ? `${result}${delimiter}${key}` : key, result );

  return strings
    .filter( str => !!str)
    .reduce( (result, str) => reduceString(result, str), '' );
};

/**
 * Generates a random string with a given length
 * @param n {Integer} length of generated string
 * @see http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 * @return {String} the random string
 * @example
 * // Returns e.g. 'pd781w0y8zpi'
 * randomString(8);
 * @example see the tests for more examples
 */
const randomString = (n=12) => Array(n+1).join((`${Math.random().toString(36)}00000000000000000`).slice(2, 18)).slice(0, n);

export { joinStrings, randomString };
