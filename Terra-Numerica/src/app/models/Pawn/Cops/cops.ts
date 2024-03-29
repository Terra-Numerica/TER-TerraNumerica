import * as d3 from 'd3';
import { Pawns } from '../pawn';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { GameService } from 'src/app/_services/game/game.service';
import { OneCopsWinStrategy } from '../../Strategy/Cop/OneCopsWinStrategy/one-cops-win-strategy';

export class Cops extends Pawns {

    /**
     * Concrete Pawn object
     * @param gameM 
     * @param graphServ 
     * @param {number} x - X position of the pawn when drawed for the first time on a canvas
     * @param {number} y - Y position of the pawn when drawed for the first time on a canvas
     * @param {number} id - Needed to differanciate a cops from another 
     */
    constructor(private gameM: GameService, private graphServ: GraphService, x: number, y: number, id: number){
        super(gameM, graphServ, x, y);
        this.role = "cops"+id
        this.strategy = new OneCopsWinStrategy();
        d3.select("svg")
        .append('circle')
            .datum(this)
            .attr("class", "pawns "+ this.role)
            .attr("cx", this.x)
            .attr("cy", this.y)
            .attr("r", this.radius)
            .style("fill", "url(#pawnCopsImage)")
            .call(d3.drag()
                .on("start", this.dragstarted.bind(this))
                .on("drag", this.dragged.bind(this))
                .on("end", this.dragended.bind(this)));
      }

      updatePosition(node) {
          if(node) this.gameM.updateCopsPosition(this, node);
      }
}