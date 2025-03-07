import { createAdress } from "../wallet"
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
})