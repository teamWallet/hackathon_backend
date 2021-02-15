import * as moment from 'moment';
import Big from 'big.js';
import { asset } from 'eos-common';
import {
  ChainDate,
  ChainAsset,
  ChainEntityName,
  ChainSymbolCode,
  ChainSymbol,
  ChainPrecision,
} from '../types';
import { isNullOrEmpty } from './helper';

/**  Expects a format of time_point/time_point_sec
 * Example here: https://eosio.stackexchange.com/questions/4830/can-we-store-date-on-eosio-table/4831
 * */
export function isValidChainDate(str: string): str is ChainDate {
  if (isNullOrEmpty(str)) return false;
  return str.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{2}\d+$/i) !== null;
}

// A string representation of an Chain symbol, composed of a float with a precision of 3-4
// ... and a symbol composed of capital letters between 1-7 letters separated by a space
// example '1.0000 ABC'
export function isValidChainAsset(str: ChainAsset | string): str is ChainAsset {
  if (isNullOrEmpty(str)) return false;
  return str.match(/^\d{1,}\.?\d{0,4} [A-Z]{1,7}$/) !== null;
}
export function isValidChainPrecision(
  num: ChainPrecision | number,
): num is ChainPrecision {
  return num && num >= 0;
}

/** Expects a string composed of up to 7 upper-case letters */
export function isValidChainSymbolCode(
  str: ChainSymbolCode | string,
): str is ChainSymbolCode {
  if (isNullOrEmpty(str)) return false;
  return str.match(/^[A-Z]{1,7}$/) !== null;
}

export function isValidChainSymbol(
  str: ChainSymbol | string,
): str is ChainSymbol {
  if (isNullOrEmpty(str)) return false;

  const [precisionStr, symbolCode] = str.split(',');
  const precision = parseInt(precisionStr);
  return isValidChainSymbolCode(symbolCode) && isValidChainPrecision(precision);
}

/** 1.x and d2.0 account rule is different */
export function isValidChainEntityName(
  str: ChainEntityName | string,
): str is ChainEntityName {
  if (isNullOrEmpty(str)) return false;
  return (
    str.match(/(^[a-z1-5.]{1,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/i) !== null
  );
}

export function toChainDate(
  date: string | Date | moment.Moment | ChainDate,
): ChainDate {
  if (typeof date === 'string') {
    if (isValidChainDate(date)) {
      return date;
    }
  } else {
    const dateString = moment(date).format('YYYY-MM-DDTHH:MM:SS.sss');
    if (isValidChainDate(dateString)) {
      return dateString;
    }
  }
  throw new Error(`Invalid toChainDate provided: ${date}`);
}

/** pads an quantity string with decimal places (specified by precision) as needed by chain
/*   e.g. quantity:'1', precision:4 = '1.0000'  */
export function toChainAssetPaddedQuantity(quantity, precision) {
  let quantityWithPadding = quantity;
  if (precision) {
    quantityWithPadding = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: precision,
      useGrouping: false,
    }).format(parseFloat(quantity));
  }
  return quantityWithPadding;
}

/** Construct a well-formatted Chain Asset string
 *  quantity is a string that must contain the number of precision digits that the token was created with
 *  e.g. '1.0000 UTU' for UTU (4 digits of precision) or '1.00 MYSM' for a token created with 2 decimals of precision */
export function toChainAssetFromSymbolCode(
  quantity: string,
  symbolCode: string,
  precision?: number,
): ChainAsset {
  const quantityWithPadding = toChainAssetPaddedQuantity(quantity, precision);

  const a = `${quantityWithPadding} ${symbolCode.toUpperCase()}`;
  // Note: the check below allows Typescript to confirm that asset can be of type ChainAsset
  // If we dont call isValidChainAsset then Typescript shows an error
  if (isValidChainAsset(a)) {
    return a;
  }
  throw new Error(
    `toChainAssetFromSymbolCode failed - quantity:${quantity} symbol:${symbolCode}`,
  );
}

/** Construct a well-formatted Chain Asset string
 *  amount is an integer with a profit of 1, including precision
 *  e.g. 10000 4,UTU =》 '1.0000 UTU', 1 4,UTU =》 '0.0001 UTU' or 100 2,MYSM => '1.00 MYSM'  */
export function toChainAsset(amount: string, symbol: ChainSymbol): ChainAsset {
  const [precisionStr, symbolCode] = symbol.split(',');
  const precision = parseInt(precisionStr);
  const amountWithPadding = Big(amount)
    .div(Big(10).pow(precision))
    .toFixed(precision);

  const a = `${amountWithPadding} ${symbolCode.toUpperCase()}`;
  // Note: the check below allows Typescript to confirm that asset can be of type ChainAsset
  // If we dont call isValidChainAsset then Typescript shows an error
  if (isValidChainAsset(a)) {
    return a;
  }
  throw new Error(
    `toChainAsset failed - amount:${amount} symbol:${symbolCode}`,
  );
}

/** Convert a string with a number and symbol into a well-formed Chain asset string - if possible
 * e.g. assetString : '1.0000 UTU',
 */
export function toChainAssetFromString(assetString = ''): ChainAsset {
  const [quantity, symbol] = assetString.split(' ');
  if (quantity && symbol) {
    return toChainAssetFromSymbolCode(quantity, symbol);
  }
  throw new Error('Cant parse assetString. Should contain a number and symbol');
}

export function toChainPrecision(precisionStr = ''): ChainPrecision {
  const precision = parseInt(precisionStr);
  if (isValidChainPrecision(precision)) {
    return precision;
  }
}

/** Construct a valid Chain SymbolCode - e.g. 'UTU' */
export function toChainSymbolCode(symbolCode = ''): ChainSymbolCode {
  if (isValidChainSymbolCode(symbolCode)) {
    return symbolCode;
  }
}

/** Construct a valid Chain SymbolCode - e.g. '4,UTU' */
export function toChainSymbol(a: ChainAsset): ChainSymbol {
  const symbolCode = asset(a)
    .symbol.code()
    .to_string();

  const precision = asset(a).symbol.precision();
  const symbol = `${precision},${symbolCode}`;
  if (isValidChainSymbol(symbol)) {
    return symbol;
  }
  throw new Error(`Get ${a} symbol: (${symbol}) error`);
}

export function toChainSymbolfromPrecision(
  symbolCode: ChainSymbolCode,
  precision: ChainPrecision,
): ChainSymbol {
  const symbol = `${precision},${symbolCode}`;
  if (isValidChainSymbol(symbol)) {
    return symbol;
  }
  throw new Error('Get symbol from precision and symbolCode error');
}

export function toChainEntityName(name: string): ChainEntityName {
  if (isValidChainEntityName(name)) {
    return name;
  }

  if (name === '') {
    return null;
  }

  const rules =
    'Up to 13 characters, last character can\'t be ".", 13th character can only be [1-5] or [a-j].';
  throw new Error(`Not a valid Chain Account name:${name}. ${rules}`);
}

/**
 * Returns a valid chainEntityName or null (Useful when the name can be null)
 */
export function toChainEntityNameOrNull(name: string): ChainEntityName {
  if (name === null || name === undefined) return null;

  return toChainEntityName(name);
}

/**
 * Returns a valid chainEntityName or empty string (Useful when chain transactions accepts empty string)
 */
export function toChainEntityNameOrEmptyString(
  name: string,
): ChainEntityName | '' {
  if (name === '') return '';

  return toChainEntityName(name);
}

export function DacArgsStandard(len: number, str: string): ChainEntityName {
  // (^[a-z1-5.]{1,11}[a-z1-5]$)
  let pwd = '';
  const expr = 'abcdefghigklmnopqrstuvwxyz12345';
  // const exprB = exprA + '.';
  const maxPos = expr.length;

  if (len < 1 || len > 8) {
    len = 8;
  }
  for (let i = 0; i < len; i++) {
    pwd += expr.charAt(Math.floor(Math.random() * maxPos));
  }
  pwd += str;
  return toChainEntityName(pwd);
}

export function DacArgsChainAsset(
  len1: number,
  len2?: number,
  symbolCode?: string,
): ChainAsset {
  // example '1.0000 ABC'
  // /^\d{1,}\.?\d{0,4} [A-Z]{1,7}$/
  let [pwd, quantity] = ['', ''];

  const exprA = '1234567890';
  const exprB = 'ABCDEFGHIGKLMNOPQRSTUVWXYZ';

  if (len1 < 0 || len1 > 4) len1 = 4;
  pwd += Math.floor(Math.random() * 10) + '.';
  for (let i = 0; i < len1; i++) {
    pwd += exprA.charAt(Math.floor(Math.random() * exprA.length));
  }
  quantity = pwd;
  if (len2) {
    pwd = '';
    if (len2 < 1 || len2 > 7) len2 = 3;
    for (let i = 0; i < len2; i++) {
      pwd += exprB.charAt(Math.floor(Math.random() * exprB.length));
    }
    symbolCode = pwd;
  }
  return toChainAssetFromSymbolCode(quantity, symbolCode);
}

export function DacArgsChainSymbol(len: number): ChainSymbolCode {
  // /^[A-Z]{1,7}$/
  let pwd = '';
  const expr = 'ABCDEFGHIGKLMNOPQRSTUVWXYZ';

  if (len < 1 || len > 7) len = 4;
  for (let i = 0; i < len; i++) {
    pwd += expr.charAt(Math.floor(Math.random() * expr.length));
  }
  return toChainSymbolCode(pwd);
}
