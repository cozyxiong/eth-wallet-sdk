import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

export function numberToHex(value: any) {
    const number = new BigNumber(value);
    const result = number.toString(16);
    return '0x' + result;
}

export function createAdress(seedHex: string, addressIndex: string) {
    const rootNode = ethers.utils.HDNode.fromSeed(Buffer.from(seedHex, 'hex'));
    const childNode = rootNode.derivePath(`m/44'/60'/0'/0/${addressIndex}`);
    const result = { 
        privateKey: childNode.privateKey,
        publicKey: childNode.publicKey,
        address: childNode.address
    };
    return JSON.stringify(result, null, 2); 
}