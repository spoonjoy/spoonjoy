/**
 * This file is for storing CSS helper methods
 */

/**
 * For conditionally stringing together different class names. For example:
```
    className={classNames(
      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
      'block px-4 py-2 text-sm'
    )}
```
 * @param classes Array of strings or booleans
 * @returns concatenated list of input strings
 */
export function classNames(...classes: Array<string | boolean>) {
  return classes.filter(Boolean).join(' ')
}
