import { createAdress, importEthWallet, publicKeyToAddress, verifyAddress, signEthTransaction } from "../wallet"
import { generateMnemonic, mnemonicToSeed } from "../wallet/bip/bip";

describe("eth wallet test", () => {

    test("create address", () => {
        const param1 = { number: 12, language: "english" };
        const mnemonic = generateMnemonic(param1);
        //const mnemonic = "";
        const param2 = { mnemonic: mnemonic, password: "" };
        const seed = mnemonicToSeed(param2);
        const addressInfo = createAdress(seed.toString("hex"), "0");
        console.log(addressInfo);
    })

    test("import eth wallet", () => {
        const privateKey = "";
        const addressInfo = importEthWallet(privateKey);
        console.log(addressInfo);
    })

    test("public key to address", () => {
        const publicKey = "";
        const addressInfo = publicKeyToAddress(publicKey);
        console.log(addressInfo);
    })

    test("verify address", () => {
        const address = "";
        const isAddress = verifyAddress(address);
        console.log(isAddress);
    })

    test("sign eth-legacy-transaction", async () => {
        const rawHex = await signEthTransaction({
            privateKey: "",
            nonce: 0,
            from: "",
            to: "",
            amount: "0.01",
            decimal: 18,
            gasLimit: 21000,
            gasPrice: 12500000000,
            chainId: 11155111,
            tokenAddress: "0x00"
        })
        console.log(rawHex);
    })

    test("sign eth-eip1559-transaction", async () => {
        const rawHex = await signEthTransaction({
            privateKey: "",
            nonce: 2,
            from: "",
            to: "",
            amount: "1",
            decimal: 6,
            gasLimit: 91000,
            maxFeePerGas: 50000000000,
            maxPriorityFeePerGas: 35000000000,
            chainId: 137,
            tokenAddress: "0x84eBc138F4Ab844A3050a6059763D269dC9951c6"
        })
        console.log(rawHex);
    })
})