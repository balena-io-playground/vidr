import { Contract, TransformerContract } from "@balena/transformer-sdk";
import {
  caterpillar2chrysalis,
  chrysalis2butterfly,
  egg2caterpillar,
} from "./index";

// DEFAULT CONTRACTS
let contracts: Contract[] = [
  {
    handle: "egg",
    type: "egg",
  },
];

// DEFINE TYPE TO TRANSFORMER FUNCTION MAP
let transformers: TypeTransformers = {
  egg: {
    function: egg2caterpillar,
    contract: {},
  },
  caterpillar: {
    function: caterpillar2chrysalis,
    contract: {},
  },
  chrysalis: {
    function: chrysalis2butterfly,
    contract: {},
  },
};

//               EDIT ABOVE
// ============================================

let final_contracts: Contract[] = [];

interface TransformerFunction {
  function: Function;
  contract: TransformerContract;
}

interface TypeTransformers {
  [key: string]: TransformerFunction | Array<TransformerFunction>;
}

let main = async () => {
  let contract = contracts.shift();
  // While there are contracts ready to be transformed, iterate
  while (typeof contract !== "undefined") {
    let transformer_functions = transformers[contract.type];
    if (typeof transformer_functions !== "undefined") {
      for (let transformer_function of Array.isArray(transformer_functions)
        ? transformer_functions
        : [transformer_functions]) {
        for (let result of await transformer_function.function({
          input: {
            contract: contract,
            transformerContract: transformer_function.contract,
            artifactPath: "./",
          },
        })) {
          console.log(result.contract.handle);
          contracts.push(result.contract);
        }
      }
    }
    final_contracts.push(contract);
    contract = contracts.shift();
  }
};

main();
