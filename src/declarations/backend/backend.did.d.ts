import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'pourWater' : ActorMethod<
    [number],
    {
      'weight' : number,
      'gameActive' : boolean,
      'targetWeight' : number,
      'isWin' : boolean,
    }
  >,
  'resetGame' : ActorMethod<[], undefined>,
  'startNewGame' : ActorMethod<[], number>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
