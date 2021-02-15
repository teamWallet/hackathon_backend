/** Brand signifiying a valid value - assigned by using toDate */
export enum ChainDateBrand {
  _ = '',
}
/** Brand signifiying a valid value - assigned by using toEntity */
export enum ChainEntityNameBrand {
  _ = '',
}
/** Brand signifiying a valid value - assigned by using toAsset */
export enum ChainAssetBrand {
  _ = '',
}

/** Brand signifiying a valid value - assigned by using toSymbolCode */
export enum ChainSymbolCodeBrand {
  _ = '',
}

/** Brand signifiying a valid value - assigned by using toSymbol */
export enum ChainSymbolBrand {
  _ = '',
}

/** Brand signifiying a valid value - assigned by using toSymbolCode */
export enum ChainPrecisionBrand {
  _ = 0,
}

// using Enum 'brands' to force a string type to have a particular format
// See - https://spin.atomicobject.com/2017/06/19/strongly-typed-date-string-typescript/
// ... and https://basarat.gitbooks.io/typescript/docs/tips/nominalTyping.html

// Chain Account name has no more than 13 characters
// Last character can't be '.'
// 13th character can only be [1-5] or [a-j]
export type ChainEntityName = string & ChainEntityNameBrand;
export type ChainDate = string & ChainDateBrand; // Datetime string in the format YYYY-MM-DDTHH:MM:SS.sss
export type ChainAsset = string & ChainAssetBrand;
export type ChainSymbolCode = string & ChainSymbolCodeBrand;
export type ChainSymbol = string & ChainSymbolBrand;
export type ChainPrecision = number & ChainPrecisionBrand;
