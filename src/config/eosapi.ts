import { Api, JsonRpc } from 'eosjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { TextDecoder, TextEncoder } = require('text-encoding');
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import fetch from 'node-fetch';
// const fetch = require('node-fetch');
const signatureProvider = new JsSignatureProvider([]);

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// EOS js
export default config => {
  console.log('Loading eosapi', config.get('endpoints'));
  const endpoints = config.get('endpoints');
  const rpc = new JsonRpc(endpoints[getRandomInt(0, endpoints.length - 1)], {
    fetch: fetch as any,
  });
  return new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  });
};
