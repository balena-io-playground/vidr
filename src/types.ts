import { ContractDefinition } from '@balena/transformer-sdk'

export interface EggData {
	[k: string]: unknown;
}

export interface EggContract extends ContractDefinition<EggData > {
    type: 'egg'
}

export interface CaterpillarData {
	numLegs: number;
	[k: string]: unknown;
}

export interface CaterpillarContract extends ContractDefinition<CaterpillarData > {
    type: 'caterpillar'
}

export interface ChrysalisData {
	[k: string]: unknown;
}

export interface ChrysalisContract extends ContractDefinition<ChrysalisData > {
    type: 'chrysalis'
}

export interface ButterflyData {
	numWings: number;
	[k: string]: unknown;
}

export interface ButterflyContract extends ContractDefinition<ButterflyData > {
    type: 'butterfly'
}

