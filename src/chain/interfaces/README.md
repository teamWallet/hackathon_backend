## chain.service

This service provides an interactive interface to the blockchain:

- Normal interface, for user account manager, call smart contract action and token transfer.
- DAC interface, for interact with the DAC.
- Exchange interace for interact with the exchange market.

Interfaces:

### Normal interface

#### newacct(name)

- **name** account name

#### xtansfer(from to foQuantity memo)

- **from**
- **to**
- **foQuantity**
- **memo**

#### getBalance(code name symbol)

- **code**
- **name**
- **symbol**

#### callAction(name)

- **code**
- **funName**
- **paramStr**
- **delimiter**

### Exchange interface

#### createPairToken(pairToken user extendedAsset1 extendedAsset2)

- Create a trading pair with your own token
- **user** User is both the creator of the trading pair and provider of initial trading depth
- **pairToken** Identification of the trading pair
- **extendedAsset1** Number of tokens in one of the trading pairs
- **extendedAsset2** Number of tokens in the other of the trading pairs

#### exchange(user pairToken  extAssetIn minExpected)
- Use your own tokens to trade in a trading pair
- **user** The Trader 
- **pairToken** Identification of the trading pair
- **extAssetIn** Number of tokens in one of the trading pairs
- **minExpected** The least available tokens, if the real tokens obtained are less than the minimum tokens, the transaction will fail

#### exchangev2(user pairToken1 pairToken2 extAssetIn minExpected)
- Use your own tokens to trade between two trading pairs through an intermediate exchange of tokens
- **user** The Trader 
- **pairToken1** Identification of the one trading pair
- **pairToken2** Identification of the other trading pair
- **extAssetIn** Number of tokens in one of the trading pairs
- **minExpected** The least available tokens, if the real tokens obtained are less than the minimum tokens, the transaction will fail

#### Specifications
- pairToken is capital letters less than eight characters