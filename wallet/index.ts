import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import Common from '@ethereumjs/common';
import { FeeMarketEIP1559Transaction, Transaction } from '@ethereumjs/tx';


// ETH-Wallet-SDK 支持的 EVM 链
const SUPPORT_CHAIN_NETWORK = {
    1: 'Ethereum',
    10: 'Optimism',
    56: 'BNBSmartChain',
    61: 'EthereumClassic',
    66: 'OKXChain',
    128: 'Heco',
    137: 'Polygon',
    324: 'zkSyncEra',
    1101: 'PolygonzkEVM',
    5000: 'Mantle',
    8217: 'Klay',
    8453: 'Base',
    9001: 'Evmos',
    10001: 'EthereumPoW',
    42161: 'Arbitrum',
    42170: 'ArbitrumNova',
    59144: 'Linea',
    11155111: 'Sepolia',
}

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

export function importEthWallet(privateKey: string) {
    const wallet = new ethers.Wallet(Buffer.from(privateKey, 'hex'));
    const result = { 
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        address: wallet.address
    };
    return JSON.stringify(result, null, 2);
}

export function publicKeyToAddress(publicKey: string) {
    return ethers.utils.computeAddress(Buffer.from(publicKey, 'hex'));
}

export function verifyAddress(address: string) {
    return ethers.utils.isAddress(address);
}

export async function signEthTransaction(params: any) {
    const { privateKey, nonce, from, to, gasLimit, gasPrice, amount, data, chainId, decimal, maxFeePerGas, maxPriorityFeePerGas, tokenAddress } = params;
    if (!(chainId in SUPPORT_CHAIN_NETWORK)) {
        throw new Error(`chainId ${chainId} is not support`);
    }
    // ethereumjs/tx 的 Transaction.fromTxData() 方法
    // 要求 txData 字段为 Buffer 或 Big Number 类型，而非十六进制字符串或普通数字。
    // ethers.utils.arrayify() 将输入解析为 Uint8Array 字节数组（二进制数据）。
    // 在 Node.js 环境中，Buffer 是 Uint8Array 的子类，因此两者兼容。

    // ethers.utils.parseUnits() 解析数值时，返回 BigNumber 对象。
    // 作用是将代币金额转换为对应代币的最小单位（如：0.01 ETH -> 0.01*1e18 wei)
    const valueBN = ethers.utils.parseUnits(amount, decimal);
    const txData: any = {
        nonce: ethers.utils.arrayify(nonce),
        from,
        to,
        gasLimit: ethers.utils.arrayify(gasLimit),
        value: ethers.utils.arrayify(valueBN),
        chainId
    };
    // 判断交易类型
    let common;
    if (maxFeePerGas && maxPriorityFeePerGas) {
        txData.maxFeePerGas = ethers.utils.arrayify(maxFeePerGas);
        txData.maxPriorityFeePerGas = ethers.utils.arrayify(maxPriorityFeePerGas);
        // common 对象用来绑定链参数和硬分叉规则
        common = Common.custom({chainId: chainId, defaultHardfork: 'london'});
    } else {
        txData.gasPrice = ethers.utils.arrayify(gasPrice);
        // common 对象 defaultHardfork 缺省为 berlin 
        common = Common.custom({chainId: chainId});
    }
    // 判断代币类型
    if (tokenAddress && tokenAddress !== '0x00') {
        // ABI 应用程序二进制接口，用于与智能合约交互
        // 定义的字符串是 Solidity 语言的 transfer 函数声明，必须和合约中的函数签名一致
        const ABI = [
            "function transfer(address to, uint amount)",
        ];
        // 实例化 ABI 接口
        const iface = new ethers.utils.Interface(ABI);
        // ABI 将函数调用和参数编码为二进制格式作为 data，以便在以太坊网络上传输
        txData.data = iface.encodeFunctionData('transfer', [to, ethers.utils.parseUnits(amount, decimal)]);
        txData.to = tokenAddress;
        txData.value = 0;
    }
    // 自定义合约调用数据，而不用 ABI 编码的方式生成的 data
    if (data) {
        txData.data = data;
    }
    // ethers V5版本不支持 EIP1559，识别不了 maxFeePerGas 和 maxPriorityFeePerGas 参数。
    // V6版本之后支持 EIP1559：
    // 1.确保 ethers.js 的 Provider 或 Signer 关联的链已启用 London 硬分叉。
    // 2.在 txData 中设置 type: 2，标识 EIP1559 交易类型。
    // const wallet = new ethers.Wallet(privateKey);
    // return wallet.signTransaction(txData);
    // 或者可以手动通过 ethereumjs/tx 库构造、签名和序列化交易：
    // 1.显示使用 London 硬分叉规则，使库能正确解析 maxFeePerGas 和 maxPriorityFeePerGas。
    // 2.显示使用 FeeMarketEIP1559Transaction 类构造 EIP1559 交易。
    // 3.手动签名交易并序列化。

    // 构建交易对象
    let tx;
    if (maxFeePerGas && maxPriorityFeePerGas) {
        tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common });
    } else {
        tx = Transaction.fromTxData(txData, { common });
    }
    // 签名交易
    const signedTx = tx.sign(Buffer.from(privateKey, 'hex'));
    // 序列化交易
    const serializedTx = signedTx.serialize();
    // 转换为十六进制字符串
    const hexTx = ethers.utils.hexlify(serializedTx);
    
    return hexTx;
}