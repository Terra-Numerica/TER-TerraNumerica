import * as d3 from 'd3';
import { PawnState } from '../pawn-state';
import { PawnStateOnTurn } from '../PawnStateOnTurn/pawn-state-on-turn';
import { PawnStateWaitingTurn } from '../PawnStateWaitingTurn/pawn-state-waiting-turn';

export class PawnStateWaitingPlacement implements PawnState {
    dragstarted(event: any, d: any) {
        d.lastPosX = event.x
        d.lastPosY = event.y
        d.settedPosition = false;
        d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
    }
    dragged(event: any, d: any) {
        console.log(d3.select(d.role))
        d3.select("."+d.role).attr("cx", event.x).attr("cy", event.y);
    }
    dragended(event: any, d: any): PawnState {
        console.log(d.settedPosition)
        d3.select(event.sourceEvent.target).attr("stroke", null);
        let circles = document.getElementsByClassName("circle");
    /* let distance = d.detectRadius;
    d3.selectAll(".node").each((nodeData:any) => {
      let h = Math.hypot(event.x - nodeData.x, event.y - nodeData.y);
      if (h <= distance) {
        distance = h;
        d.lastPosX = nodeData.x
        d.lastPosY = nodeData.y
        d.settedPosition = true
        d.firstMove = false;
        d.yourTurn = false;
      }
    })
    d3.select(this as any).attr("cx", d.x = d.lastPosX).attr("cy", d.y = d.lastPosY); */
        for (let i = 0; i<circles.length; i++ ) {
            let c = circles[i] as any;
            console.log(c)
            console.log(d)
            console.log(event)
            if (c.cx.baseVal.value - d.detectRadius <= event.x && event.x <= c.cx.baseVal.value + d.detectRadius) {
                if (c.cy.baseVal.value - d.detectRadius <= event.y && event.y <= c.cy.baseVal.value + d.detectRadius) {
                    d.possiblePoints = d.graphService.showPossibleMove(c)
                    d.lastSlot = c;
                    d3.select(event.sourceEvent.target).attr("cx", d.x = c.cx.baseVal.value).attr("cy", d.y = c.cy.baseVal.value);
                    d.settedPosition = true;
                    d.firstMove = false;
                    d.yourTurn = false;
                    
                    break;
                }
            }
        }
        if (d.settedPosition == false){
            d3.select(event.sourceEvent.target).attr("cx", d.x = d.lastPosX).attr("cy", d.y = d.lastPosY);
            return new PawnStateWaitingPlacement();
        }
        return new PawnStateWaitingTurn();
    }
}
