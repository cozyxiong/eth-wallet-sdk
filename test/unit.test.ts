import { createAdress, importEthWallet, publicKeyToAddress, verifyAddress } from "../wallet"
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
})