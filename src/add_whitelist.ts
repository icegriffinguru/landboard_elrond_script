import * as fs from 'fs';
import {
    Balance,
    GasLimit,
    Transaction,
    TransactionPayload,
    Egld,
    ArgSerializer,
    Address,
    BytesValue,
    BigUIntValue,
    ContractFunction,
    AddressValue
} from "@elrondnetwork/erdjs";
import BigNumber from "@elrondnetwork/erdjs/node_modules/bignumber.js/bignumber.js";

import {
    DELAY_TIME,
    WHITELIST_FILE_PATH,
    MAX_GAS_PER_TRANSACTIONS
} from './config';
import {
    sleep
} from './util';
import {
    provider,
    account,
    signer,
    contract
} from './provider';

// read addresses from csv file
const readWhitelistFromFile = () => {
    const whitelist = fs.readFileSync(WHITELIST_FILE_PATH, 'utf-8').trim().replace(/(\r\n|\n|\r)/gm, '').split(",");
    // console.log(whitelist);
    return whitelist;
}

const sendAddWhitelistTx = async (whitelist: string[]) => {
    const args = whitelist.map((item) => new AddressValue(new Address(item)));
    // console.log('>>>args', args);

    await account.sync(provider);
    let tx = contract.call({
        func: new ContractFunction('addWhitelist'),
        gasLimit: new GasLimit(MAX_GAS_PER_TRANSACTIONS),
        // value: Balance.egld(0),
        args: args
    });
    tx.setNonce(account.nonce);
    await signer.sign(tx);
    const txHash = await tx.send(provider);
    // console.log('Tx => ', tx);
    console.log("Tx Hash => ", txHash.toString());
}

(async () => {
    const whitelist = readWhitelistFromFile();
    await sendAddWhitelistTx(whitelist);
})();
