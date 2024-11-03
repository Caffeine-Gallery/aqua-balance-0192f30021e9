import Bool "mo:base/Bool";
import Int "mo:base/Int";

import Float "mo:base/Float";
import Random "mo:base/Random";
import Time "mo:base/Time";
import Debug "mo:base/Debug";

actor {
  // Game state variables
  stable var currentWeight : Float = 0.0;
  stable var targetWeight : Float = 0.0;
  stable var isGameActive : Bool = false;

  // Initialize new game with random target weight
  public func startNewGame() : async Float {
    currentWeight := 0.0;
    let seed = Float.fromInt(Time.now());
    targetWeight := (seed % 1000.0) / 100.0 + 1.0; // Random weight between 1-11
    isGameActive := true;
    targetWeight
  };

  // Pour water with variable amount and check win condition
  public func pourWater(amount : Float) : async {
    weight : Float;
    isWin : Bool;
    targetWeight : Float;
    gameActive : Bool;
  } {
    if (not isGameActive) {
      return {
        weight = currentWeight;
        isWin = false;
        targetWeight = targetWeight;
        gameActive = false;
      };
    };

    currentWeight += amount;
    
    // Check win condition (within 0.1 of target)
    let isWin = Float.abs(currentWeight - targetWeight) < 0.1;
    if (isWin or currentWeight > targetWeight + 0.1) {
      isGameActive := false;
    };

    {
      weight = currentWeight;
      isWin = isWin;
      targetWeight = targetWeight;
      gameActive = isGameActive;
    }
  };

  // Reset game state
  public func resetGame() : async () {
    currentWeight := 0.0;
    isGameActive := false;
  };
}
