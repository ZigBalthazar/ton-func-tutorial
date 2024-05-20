import * as fs from "fs"
import process from "process"
import { Cell } from "ton-core"
import { compileFunc } from "@ton-community/func-js"

async function compileScript() {
    const compileResult = await compileFunc({
        targets: ["./contracts/main.fc"],
        sources: (x)=> fs.readFileSync(x).toString("utf-8")
    })

    if (compileResult.status == "error"){
        throw new Error(compileResult.message)
    }

    const hexArtifact = "./build/main.compiled.json"

    fs.writeFileSync(hexArtifact,JSON.stringify({hex:Cell.fromBoc(Buffer.from(compileResult.codeBoc,"base64"))[0].toBoc().toString("hex")}))
}

compileScript().then(()=>{
    console.log("compile done")
    process.exit(0)
}).catch((err)=>{
    console.log(err)
    process.exit(1)
})