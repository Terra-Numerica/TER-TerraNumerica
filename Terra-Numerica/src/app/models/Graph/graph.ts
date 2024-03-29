import { index, SimulationNodeDatum } from 'd3';
import * as d3 from 'd3';

export abstract class Graph {
    private _typology: string;
    private _nodes;
    private _links;
    private _svgNodes;
    private _svgLinks;
    protected simulation;
    protected movingCircleOriginalPosition;
    protected allowedToMove = false;

    constructor(nodes, links, typology: string) {
        this._nodes = [...nodes];
        this._links = [...links];   
        this._typology = typology;
    }

    setAllowedToMove(allowedToMove: boolean) {
        this.allowedToMove = allowedToMove
    }

    /* ---------- GRAPH DRAWING ---------- */
    /**
     * Function who populate an html svg canvas with circles and lines to represent a graph
     * @param svg d3 selection of an html svg
     */
    draw(svg: any) {
        /* console.log('LINKS', this.links)
        console.log('NODES', this.nodes) */

        this.svgLinks = svg.selectAll("line")
            .data(this.links)
            .join("line")
                .style("stroke", "#aaa")

        this.svgNodes = svg.selectAll("circle")
            .data(this.nodes)
            .join("circle")
                .attr("r", 20)
                .attr("class", "circle")
                .attr("index", d => d.index)
                .style("fill", "#69b3a2")
                .call(
                    d3.drag()
                    .on('start', (event: DragEvent) => {
                        /* console.log('OTHER') */
                        this.dragstarted(event)
                    })
                    .on('drag', (event: DragEvent) => {
                        this.dragged(event)
                    })
                    .on('end', (event: DragEvent) => {
                        this.dragended(event)
                    })
                )
        
        this.simulate(svg);

    }

    // Drag & Drop Functions
    dragstarted(event) {
      if(this.allowedToMove) {
        /* console.log('EVENT', event) */
        this.movingCircleOriginalPosition = {
          x: event.sourceEvent.target.cx.baseVal.value,
          y: event.sourceEvent.target.cy.baseVal.value
        }
        /* console.log('HERE WE ARE', this.movingCircleOriginalPosition) */
        d3.select(event.sourceEvent.target).attr('stroke', 'black');
      }
    }

    dragged(event) {
      if(this.allowedToMove) {
        const circle = event.sourceEvent.target
        d3.select(circle).raise().attr("cx", event.x).attr("cy", event.y);
      }
    }

    dragended(event) {
        if(this.allowedToMove) {
            const circle = d3.select(event.sourceEvent.target)
            circle.attr('stroke', null);
            /* const endPositon = {
                x: +circle.attr('cx'),
                y: +circle.attr('cy')
            } */
            this.moveNode(this.movingCircleOriginalPosition, {x: +circle.attr('cx'), y: +circle.attr('cy')})
        }
    }

    moveNode(movingCircle, endPosition) {
        const nodeIndex = this.nodes.findIndex(node => this.checkApproximativeCirclePosition(node, movingCircle))

        this.links.forEach((link) => {
            /* console.log('LINK', link) */
            if (link.source.index === nodeIndex || link.source === nodeIndex) {
                const lines = d3.selectAll('line').nodes();
                for(const l of lines) {
                    const tmp = d3.select(l);
                    if((tmp.attr('x1') == link.source.x && tmp.attr('y1') == link.source.y)
                        || (tmp.attr('source-index') == link.source && tmp.attr('target-index') == link.target)) {
                        tmp.attr('x1', endPosition.x).attr('y1', endPosition.y)
                        break;
                    }
                }
            } else if (link.target.index === nodeIndex || link.target === nodeIndex) {
                const lines = d3.selectAll('line').nodes();
                for(const l of lines) {
                    const tmp = d3.select(l);
                    if((tmp.attr('x2') == link.target.x && tmp.attr('y2') == link.target.y)
                        || (tmp.attr('source-index') == link.source && tmp.attr('target-index') == link.target)) {
                        tmp.attr('x2', endPosition.x).attr('y2', endPosition.y)
                        break;
                    }
                }
            }
        })

        const circles = d3.selectAll('circle')
        for(const circle of circles) {
            const tmp = d3.select(circle)
            if(tmp.attr('index') == nodeIndex) {
                tmp.attr('cx', endPosition.x).attr('cy', endPosition.y)
            }
        }

        this.nodes[nodeIndex].x = endPosition.x
        this.nodes[nodeIndex].y = endPosition.y
    }

    private checkApproximativeCirclePosition(originalPosition, newPosition) {
        return (originalPosition.x -1 < newPosition.x && newPosition.x < originalPosition.x + 1) 
                && (originalPosition.y -1 < newPosition.y && newPosition.y < originalPosition.y + 1)
    }

    /**
     * Function to generate de the D3 network datum for the good use of the graph
     * @param svg d3 selection of an html svg
     */
    abstract simulate(svg: any): void;

    abstract stop();

    /**
     * Function needed by the force simulation of D3.js library
     */
    abstract ticked(): void;

    /* ---------- GRAPH COMPUTATIONS ---------- */

    getRandomEdge(): SimulationNodeDatum {
        return {...this._nodes[this.getRandomInt(this._nodes.length-1)]};
    }

    /**
     * Tool function to compute the edges of a node for a graph
     * @param {any} node - from where you need to computes edges
     * @returns {SimulationNodeDatum[]} list of edges of the node param
     */
    edges(node, speed = 1, exclude= []): SimulationNodeDatum[] {
        const edges = [];
        if(node.index === undefined) {
            node = node.__data__
        }
        for(const l of this.links) {
            if(l.source.index === node.index) {
                edges.push(this._nodes.find(n => n.index === l.target.index))
            } else if (l.target.index === node.index) {
                edges.push(this._nodes.find(n => n.index === l.source.index))
            } else if (l.source === node.index) {
                edges.push(this._nodes.find(n => n.index === l.target))
            } else if (l.target === node.index) {
                edges.push(this._nodes.find(n => n.index === l.source))
            }
        }
        if(speed > 1) {
            return this.globalEdges(edges, --speed, exclude)
        }
        return edges;
    }

    private globalEdges(edges, speed, exclude = []) {
        let result: any[] = edges;
        let new_edges = [...edges];
        while(speed !== 0) {
            /* console.log('EXCLUDING EDGES', exclude)
            console.log('NEW EDGES', new_edges) */
            const tmp = [];
            for(const e of new_edges) {
                //console.log('THERE', exclude.includes(e))
                if(!exclude.includes(e)) {
                    this.edges(e).forEach(n => {
                        /* console.log('FIND', exclude.some(el => el.index === n.index)) */
                        if(!result.find(el => el.index === n.index) && !exclude.some(el => el.index === n.index)) {
                            result.push(n);
                            tmp.push(n)
                        } 
                    })
                }
            }
            new_edges = tmp;
            speed--;
        }
        return result;
    }

    /**
     * Function to get a random edge of a node of a graph
     * @param n node from where you need to get a random edge
     * @returns a random edge of the input node
     */
    getRandomAccessibleEdges(n, speed) {
        const edges = this.edges(n, speed);
        return edges[this.getRandomInt(edges.length)];
    }

    distance(n1, n2) {
        if(n2.index === undefined) { // DO NOT CHANGE TO if(!n2.index) because index use number
            n2 = {index: +n2}
        }

        let distance = 0;
        let marked = [];
        marked.push(n1.index);
        if(n1.index===n2.index) {
            return distance;
        }

        
        let edges = this.edges(n1).filter(e => !(marked.includes(e.index)));
        
        while(edges.length > 0) {
            distance++;
            for(const e of edges) {
                if(e.index == n2.index) return distance;
            }
            const save =  edges;
            edges = []
            for(const e of save) {
                const temp = this.edges(e).filter(i => !(marked.includes(i.index))).forEach(edge => {
                    let isIn = false
                    for(const i of edges) {
                        if(i.index === edge.index) {
                            isIn = true;
                        }
                    }
                    if(!isIn) edges.push(edge)
                })
                marked.push(e.index);
            }
        }
        return -1;
    }

    /* ---------- PROPERTIES ---------- */

    // GETTERS
    get nodes() {
        return this._nodes
    }

    get links() {
        return this._links
    }

    get typology(): string {
        return this._typology
    }

    get svgNodes() {
        return this._svgNodes
    }

    get svgLinks() {
        return this._svgLinks
    }

    // SETTERS

    set nodes(n) {
        this._nodes = n;
    }

    set links(l) {
        this._links = l;
    }

    set typology(type: string) {
        this._typology = type;
    }

    set svgNodes(nodes) {
        this._svgNodes = nodes
    }

    set svgLinks(links) {
        this._svgLinks = links
    }

    /* -------------------------------- */
    private getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
