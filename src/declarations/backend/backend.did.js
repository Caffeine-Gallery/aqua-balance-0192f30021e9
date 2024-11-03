export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'pourWater' : IDL.Func(
        [IDL.Float64],
        [
          IDL.Record({
            'weight' : IDL.Float64,
            'gameActive' : IDL.Bool,
            'targetWeight' : IDL.Float64,
            'isWin' : IDL.Bool,
          }),
        ],
        [],
      ),
    'resetGame' : IDL.Func([], [], []),
    'startNewGame' : IDL.Func([], [IDL.Float64], []),
  });
};
export const init = ({ IDL }) => { return []; };
