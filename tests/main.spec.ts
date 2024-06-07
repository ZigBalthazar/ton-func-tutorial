import { Cell, Address, toNano } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import "@ton-community/test-utils";
describe("main.fc contract tests", () => {
  it("our first test", async () => {
    const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
    const blockchain = await Blockchain.create();

    const initAddress = await blockchain.treasury("A");

    const myContract = blockchain.openContract(
      MainContract.createFromConfig(
        {
          address: initAddress.address,
          number: 0,
        },
        codeCell
      )
    );

    const senderWallet = await blockchain.treasury("sender");

    const sendMessageResult = await myContract.sendIncrement(
      senderWallet.getSender(),
      toNano("0.05"),
      3
    );
    expect(sendMessageResult.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: true,
    });

    const a = await myContract.getData();

    expect(a.recent_sender.toString()).toBe(senderWallet.address.toString());
    expect(a.number).toBe(3);
  });
});
