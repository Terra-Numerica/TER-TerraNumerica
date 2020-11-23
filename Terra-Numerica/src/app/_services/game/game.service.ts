import { Injectable } from '@angular/core';
import { Cops } from 'src/app/models/Pawn/Cops/cops';
import { Pawns } from 'src/app/models/Pawn/pawn';
import { PawnState } from 'src/app/models/Pawn/PawnState/pawn-state';
import { Thief } from 'src/app/models/Pawn/Thief/thief';
import { environment } from 'src/environments/environment';
import * as d3 from 'd3';
import { GameActionStack } from 'src/app/models/GameActionStack/game-action-stack';
import { GameAction } from 'src/app/models/GameAction/game-action';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private cops: Cops[];
  private thiefs: Thief[];
  private thiefTurn = true;
  private turnCount = 0;
  private placingPawns = true;
  private winner: string;
  private actionStack: GameActionStack;

  constructor() {
    this.actionStack = new GameActionStack();
  }

  setThief(thiefs) {
    this.thiefs = thiefs;
  }

  setCops(cops) {
    this.cops = cops;
  }

  update() {
    console.log('HERE',this.peekAction());
    if(this.placingPawns) {
      this.checkPlacement();
      if(!this.placingPawns) {
        this.startGame();
        d3.select('#main-message')
          .style('color', 'green')
          .text(() => 'C\'est au tour du voleur.');
      }
    }
    else {
      this.updateStates();
    }
    console.log('TURN #',this.turnCount)
    if(this.checkEnd()) {
      console.log('GAME IS FINISHED')
      console.log('THE WINNER IS :'+ this.winner);
    }
  }

  private checkPlacement() {
    let placing = false;
    for(let i=0; i<this.thiefs.length; i++) {
      placing = placing || this.thiefs[i].isWaitingPlacement();
    }
    for(let i=0; i<this.cops.length; i++) {
      placing = placing || this.cops[i].isWaitingPlacement();
    }
    this.placingPawns = placing;
  }

  private startGame() {
    console.log('GAME IS STARTING')
    this.setPlayersTurn(this.thiefs);
    this.turnCount++;
  }

  private updateStates() {
    if(this.thiefTurn) {
      let allThiefHasPlayed = true;
      for(let i=0; i< this.thiefs.length; i++) {
        allThiefHasPlayed = allThiefHasPlayed && !this.thiefs[i].onTurn();
      }
      this.thiefTurn = !allThiefHasPlayed;
      /* if(!this.thiefTurn) {
        this.turnCount++;
        this.setPlayersTurn(this.cops);
        d3.select('#main-message')
          .style('color', 'blue')
          .text(() => 'C\'est au tour des policiers.');
      } */
    } else {
      let allCopsHasPlayed = true;
      for(let i=0; i< this.cops.length; i++) {
        allCopsHasPlayed = allCopsHasPlayed && !this.cops[i].onTurn();
      }
      this.thiefTurn = allCopsHasPlayed;
      /* if(this.thiefTurn) {
        this.turnCount++;
        this.setPlayersTurn(this.thiefs);
        d3.select('#main-message')
          .style('color', 'green')
          .text(() => 'C\'est au tour du voleur.');
      } */
    }
  }

  private setPlayersTurn(players: Pawns[]) {
    for(let i=0; i<players.length; i++) {
      players[i].state = environment.onTurnState;
    }
  }

  private checkEnd() {
    let allThiefCapture = false;
    for(let i=0; i<this.thiefs.length; i++) {
      const t = this.thiefs[i];
      for(let j=0; i<this.cops.length; i++) {
        allThiefCapture = allThiefCapture || t.isAtSamePostionAs(this.cops[i]);
      }
    }
    let timerEnd = this.turnCount > 15
    if(allThiefCapture) this.winner = 'Policiers';
    else if(timerEnd) this.winner = 'Voleur';
    return allThiefCapture || timerEnd;
  }

  getTurnCount() {
    return this.turnCount;
  }

  validateTurn() {
    this.turnCount++;
    this.clearActions();
    if(this.thiefTurn) {
      this.setPlayersTurn(this.thiefs);
      d3.select('#main-message')
        .style('color', 'green')
        .text(() => 'C\'est au tour du voleur.');
    } 
    else {
      this.setPlayersTurn(this.cops);
      d3.select('#main-message')
        .style('color', 'blue')
        .text(() => 'C\'est au tour des policiers.');
    }
  }

  //GameAction related function
  addGameAction(action: GameAction) {
    this.actionStack.push(action);
  }

  cancelAction(): boolean {
    return this.actionStack.cancelAction();
  }

  isGameActionEmpty() {
    return this.actionStack.isEmpty();
  }

  peekAction() {
    return this.actionStack.peek();
  }

  private clearActions() {
    this.actionStack.clear();
  }

}
