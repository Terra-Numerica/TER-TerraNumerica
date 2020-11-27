import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Cycle } from 'src/app/models/Graph/Cycle/cycle';
import { Graph } from 'src/app/models/Graph/graph';
import { Grid } from 'src/app/models/Graph/Grid/grid';
import { Tree } from 'src/app/models/Graph/Tree/tree';
import { RandomGraphService } from '../random-graph/random-graph.service';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  
  private graph: Graph;

  private gameMode;

  constructor(private randomGraph: RandomGraphService) {}

  drawGraph(svg) {
    this.graph.draw(svg);
  }

  generateGraph(type: string, args?: any[]) {
    this.graph = null;
    switch(type) {
      case 'grid':
        this.graph = this.generateGrid(args[0], args[1]);
        break;
      case 'cycle':
        this. graph = this.generateCycle(args[0]);
        break;
      case 'tree':
        this.graph = this.generateTree(args[0], args[1]);
        break;
      // case 'random':
      //   this.grid.cells = [];
      //   this.randomGenerator();
      // case 'copsAlwaysWin':
      //   this.grid.cells = [];
      //   this.oneCopsGraph(args[0])
      //   break;
      // case 'random':
      //   this.grid.cells = [];
      //   this.randomGenerator();
    } 
  }

  generatesNodes(n: number): any[] {
    let nodes = [];
    for(let i=0 ; i < n ; ++i) {
      nodes.push({
        index: i,
      });
    }
    return nodes;
  }

  generateGrid(width: number, height: number): Grid {

    const size = width*height;
    let nodes = this.generatesNodes(size);
    let links = [];

    let count = 0;
    for(let i = 0 ; i < height ; ++i) {
        for(let j = 0 ; j < width-1 ; ++j) {
            links.push({
              source: count,
              target: count+1
            })
            count++;
        }
        count++
    }

    for(let i = 0 ; i < height-1 ; ++i) {
        for(let j = 0 ; j < width ; ++j) {
            links.push({
              source: (width*i)+j,
              target: (width*i)+j+width
            });
        }
    }

    return new Grid(nodes, links, width, height);
  }

  generateCycle(size: number): Cycle {
    let nodes = this.generatesNodes(size);
    let links = [];

    for(let i: number = 0 ; i < size-1 ; ++i) {
      links.push({
        source: i,
        target: i+1
      })
    }
    links.push({
      source: 0,
      target: size-1
    })

    return new Cycle(nodes, links);
  }

  generateTree(size: number, arity: number): Tree {

    let nodes = this.generatesNodes(size);
    let links = [];

    for(let i = 0 ; i < size ; ++i) {
      for(let j = 1 ; j <= arity && (i*arity)+j < size ; ++j) {
        links.push({
          source: i,
          target: (i*arity) + j
        });
      }
    }

    return new Tree(nodes, links);
  }

  readAsync(file: File): Promise<Graph> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        let config = JSON.parse(reader.result.toString());
        resolve(config);
      };
      reader.onerror = () => {
          reject (new Error ('Unable to read..'));
      };
      reader.readAsText(file);
    });
  }
  
  async loadGraphFromFile(file: File) {
    const config = await this.readAsync(file);
    this.importGraph(config);
  }

  importGraph(config) {
    this.graph = null;
    switch(config.typology) {
      case 'grid':
        this.graph = new Grid(config.nodes, config.links, config.width, config.height);
        break;
      case 'cycle':
        this.graph = new Cycle(config.nodes, config.links);
        break;
      case 'tree':
        this.graph = new Tree(config.nodes, config.links);
        break;
      // case 'random':
      //   this.grid.cells = [];
      //   this.randomGenerator();
    }
  }

  getNodes() {
    return this.graph.nodes;
  }

  getLinks() {
    return this.graph.links;
  }

  edges(node) {
    return this.graph.edges(node);
  }

  distance(n1, n2) {
    return this.graph.distance(n1, n2);
  }

  setGameMode(gameMode){
    this.gameMode = gameMode
  }

  showPossibleMove(vertex) {
    const edges = this.graph.edges(vertex.__data__)
    d3.selectAll(".circle").style("fill", '#69b3a2');
    if(this.gameMode === "facile" || this.gameMode === "normal") {
      vertex.style.fill = "blue"
      d3.selectAll(".circle").filter(function(d: any) {
        return edges.includes(d);
      }).style("fill", "red");
    }
    return edges;
  }

  // private oneCopsGraph(n) {
  //   this.clearGraph
  //   this.initNodes(n)
  //   let numberOfSpecialNode = Math.floor(1 + Math.random() * Math.floor((n/2)-1));
  //   for(let i=0; i<n-1; i++){
  //     this.graph.links.push({source: i, target: i+1});
  //   }
  //   console.log(numberOfSpecialNode)
  //   for(let i=0; i<numberOfSpecialNode; i++){
  //     let idNode1 = Math.floor(Math.random() * Math.floor(n))
  //     let node1 = this.graph.nodes[idNode1];
  //     let node2 = this.graph.nodes[Math.floor(idNode1 + Math.random() * Math.floor(n - idNode1))];
  //     for(let i=0; i<3; i++){
  //       let idOfNodeLinkedRandomly = Math.floor(idNode1 + Math.random() * Math.floor(n - idNode1));
  //       console.log(node1)
  //       console.log(node2)
  //       this.graph.links.push({source: node1, target: idOfNodeLinkedRandomly});
  //       this.graph.links.push({source: node2, target: idOfNodeLinkedRandomly});
  //     }
  //     this.graph.links.push({source: node1, target: node2});    
  //   }
  // }

  // private randomGenerator(){
  //   let rGraph = this.randomGraph.getRandomGraph();
  //   this.clearGraph();
  //   this.initNodes(rGraph.nodes.length);
  //   rGraph.links.forEach(l => {
  //     this.graph.links.push(l)
  //   });
  // }
}
