import { parse, stringify } from 'flatted';

export function isAUint8Array(obj: any) {
  return obj !== undefined && obj !== null && obj.constructor === Uint8Array;
}

export function isAUint8ArrayArray(obj: any) {
  if (obj === undefined || obj === null || !Array.isArray(obj)) {
    return false;
  }
  return (obj as Array<any>).every(isAUint8Array);
}

export function isABuffer(value: any) {
  if (value === undefined || value === null) return false;
  return Buffer.isBuffer(value);
}

export function isNullOrEmpty(obj: any): boolean {
  if (obj === undefined) {
    return true;
  }
  if (obj === null) {
    return true;
  }

  if (isAUint8Array(obj)) {
    return obj.length === 0;
  }

  if (isABuffer(obj)) {
    return obj.byteLength === 0;
  }

  // Check for an empty array too
  // eslint-disable-next-line no-prototype-builtins
  if (obj.hasOwnProperty('length')) {
    if (obj.length === 0) {
      return true;
    }
  }
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function getArrayIndexOrNull(array: any[] = [], index: number) {
  if (array.length > index && !isNullOrEmpty(array[index])) {
    return array[index];
  }
  return null;
}

// uses flatted library to allow stringifing on an object with circular references
// NOTE: This does not produce output similar to JSON.stringify, it has it's own format
// to allow you to stringify and parse and get back an object with circular references
export function stringifySafe(obj: any): any {
  return stringify(obj);
}

// this is the inverse of stringifySafe
// if converts a specially stringifyied string (created by stringifySafe) back into an object
export function parseSafe(string: string): any {
  return parse(string);
}

// convert data into buffer object (optional encoding)
export function toBuffer(data: any, encoding: BufferEncoding = 'utf8') {
  if (!data) return null;
  return Buffer.from(data, encoding);
}

// convert buffer into a string
export function bufferToString(buffer: Buffer) {
  if (!buffer) return null;
  return buffer.toString();
}

// convert buffer into a Uint8Array
export function bufferToUint8Array(buffer: Buffer) {
  if (!buffer) return null;
  return new Uint8Array(buffer.buffer);
}

export function uint8ArraysAreEqual(array1: Uint8Array, array2: Uint8Array) {
  return Buffer.compare(array1, array2) === 0;
}

/** filter values in array down to an array of a single, uniques value
 * e.g. if array = [{value:'A', other}, {value:'B'}, {value:'A', other}]
 * distinct(array, uniqueKey:'value') => ['A','B']
 */
export function distinctValues(values: Array<any>, uniqueKey: string) {
  return [...new Set(values.map(item => item[uniqueKey]))];
}

/** combine one array into another but only include unique values */
export function addUniqueToArray<T>(array: T[], values: T[]) {
  const arrayFixed = array ?? [];
  const valuesFixed = values ?? [];
  const set = new Set<T>([...arrayFixed, ...valuesFixed]);
  return [...set];
}

export function isAString(value: any) {
  if (!value) {
    return false;
  }
  return typeof value === 'string' || value instanceof String;
}

export function isADate(value: any) {
  return value instanceof Date;
}

export function isABoolean(value: any) {
  return typeof value === 'boolean' || value instanceof Boolean;
}

export function isANumber(value: any) {
  if (Number.isNaN(value)) return false;
  return typeof value === 'number' || value instanceof Number;
}

export function isAnObject(obj: any) {
  return !isNullOrEmpty(obj) && typeof obj === 'object';
}

/** Typescript Typeguard to verify that the value is in the enumType specified  */
export function isInEnum<T>(enumType: T, value: any): value is T[keyof T] {
  return Object.values(enumType).includes(value as T[keyof T]);
}

export function getUniqueValues<T>(array: T[]) {
  return Array.from(
    new Set(array.map(item => JSON.stringify(item))),
  ).map(item => JSON.parse(item));
}

export function trimTrailingChars(value: string, charToTrim: string) {
  if (isNullOrEmpty(value) || !isAString(value)) return value;
  const regExp = new RegExp(`${charToTrim}+$`);
  return value.replace(regExp, '');
}

export const removeEmptyValuesInJsonObject = (obj: { [x: string]: any }) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object')
      removeEmptyValuesInJsonObject(obj[key]);
    // recurse
    // eslint-disable-next-line no-param-reassign
    else if (isNullOrEmpty(obj[key])) delete obj[key]; // delete the property
  });
};

export const notImplemented = () => {
  throw new Error('Not Implemented');
};

export const notSupported = (description: string) => {
  throw new Error(`Not Supported ${description}`);
};

/**
 * Returns an the first value from the array if only 1 exists, otherwise returns null
 */
export function getFirstValueIfOnlyOneExists(array: any[]): any {
  const lengthRequirement = 1;
  if (!isNullOrEmpty(array) && array.length === lengthRequirement) {
    const [firstValue] = array;
    return firstValue;
  }

  return null;
}
