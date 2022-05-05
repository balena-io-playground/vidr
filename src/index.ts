import { InputManifest, Result } from "@balena/transformer-sdk";
import type {
  EggContract,
  CaterpillarContract,
  ChrysalisContract,
  ButterflyContract,
} from "./types";

export async function egg2caterpillar(
  input: InputManifest<EggContract>
): Promise<Result<CaterpillarContract>[]> {
  let out: Result<CaterpillarContract>[] = [{
    contract: {
        handle: `${input.input.contract.handle}_caterpillar`,
        type: "caterpillar",
    },
  }];

  return out;
}

export async function caterpillar2chrysalis(
  input: InputManifest<CaterpillarContract>
): Promise<Result<ChrysalisContract>[]> {
  let out: Result<ChrysalisContract>[] = [{
    contract: {
        handle: `${input.input.contract.handle}_crysalis`,
        type: "chrysalis",
    },
  }];

  return out;
}

export async function chrysalis2butterfly(
  input: InputManifest<ChrysalisContract>
): Promise<Result<ButterflyContract>[]> {
  let out: Result<ButterflyContract>[] = [{
    contract: {
        handle: `${input.input.contract.handle}_butterfly`,
        type: "butterfly",
    },
  }];

  return out;
}
