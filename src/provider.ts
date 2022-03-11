import {
    Account,
    UserSigner,
    ProxyProvider,
    NetworkConfig,
    ChainID,
    SmartContract,
    Address
} from "@elrondnetwork/erdjs";
import * as fs from "fs";
import BigNumber from "@elrondnetwork/erdjs/node_modules/bignumber.js/bignumber.js";

import {
    GATEWAY_URL,
    CHAIN_ID,
    PEM_PATH,
    SC_ADDRESS
} from './config';

BigNumber.set({ DECIMAL_PLACES: 18, ROUNDING_MODE: 4 });

export const provider = new ProxyProvider(GATEWAY_URL, { timeout: 5000 });

let config = NetworkConfig.getDefault();
config.ChainID = new ChainID(CHAIN_ID);
config.sync(provider);

const pem = fs.readFileSync(PEM_PATH, { encoding: 'utf-8' }).trim();

export const signer = UserSigner.fromPem(pem);
export const account = new Account(signer.getAddress());

export const contract = new SmartContract({
    address: new Address(SC_ADDRESS)
});