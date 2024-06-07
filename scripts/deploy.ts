import {
  beginCell,
  Cell,
  contractAddress,
  StateInit,
  storeStateInit,
  toNano,
} from "ton-core";
import { hex } from "../build/main.compiled.json";
import QueryString from "qs";
import qrcode from "qrcode-terminal"

async function deploy() {
  const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
  const dataCell = new Cell();

  const stateInit: StateInit = {
    code: codeCell,
    data: dataCell,
  };

  const stateInitBuilder = beginCell();
  storeStateInit(stateInit)(stateInitBuilder);
  const stateInitCell = stateInitBuilder.endCell();

  const address = contractAddress(0, {
    code: codeCell,
    data: dataCell,
  });

//   const stateInitCell = beginCell()
//     .storeBit(false)
//     .storeBit(false)
//     .storeMaybeRef(codeCell)
//     .storeMaybeRef(dataCell)
//     .storeUint(0, 1)
//     .endCell();



    let link = 'https://test.tonhub.com/transfer/'+address.toString({
        testOnly:true
    })+"?"+QueryString.stringify({
        text:"Deploy Contract",
        amount: toNano("0.05").toString(10),
        init: stateInitCell.toBoc({idx:false}).toString("base64")
    })

    qrcode.generate(link,{small:true},(code)=>{
        console.log(code)
    })
}

deploy();
