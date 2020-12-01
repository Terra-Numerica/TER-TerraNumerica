import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { RandomGraphService } from 'src/app/_services/random-graph/random-graph.service';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss']
})
export class GameMenuComponent implements OnInit {

  private selectedGraphType = 'grid';
  public selectedOpponentType = 'player';
  public availableGraphType = ['grid', 'cycle', 'tree', 'random'];
  public availableOpponentType = ['ia', 'player'];

  public gameModeSelected = "easy";
  public paramsNames;
  public graphParam1 = 1;
  public graphParam2 = 1;
  public cops = 1;

  constructor(private router: Router, private formBuilder: FormBuilder, private randomGraph: RandomGraphService) { }

  ngOnInit(): void {
    this.updateParamsName();
    this.randomGraph.loadGraphs();
  }

  selectGraphType(type: string) {
    this.selectedGraphType = type;
    this.updateParamsName();
    this.paramSafetyCheck();
  }

  updateParamsName() {
    switch(this.selectedGraphType) {
      case 'grid':
        this.paramsNames = ['Largeur :', 'Longueur :'];
        break;
      case 'cycle':
        this.paramsNames = ['Nombre de noeuds :']
        break;
      case 'tree':
        this.paramsNames = ['Nombre de noeuds :', 'Arité de l\'arbre :']
        break;
      case 'random':
        this.paramsNames = []
        break;
      default:
        break;
    }
  }

  selectPlayer(opponent) {
    this.selectedOpponentType = opponent;
  }

  validateParams() {
    this.paramSafetyCheck();
    switch(this.gameModeSelected){
    case 'easy':
      break;
    case 'medium':
      break;
    case 'hard':
      break;
    }
    const extras: NavigationExtras = {
      queryParams: {
        copsNum: this.cops,
        graphType: this.selectedGraphType,
        oppenent: this.selectedOpponentType,
        graphParams: [this.graphParam1, this.graphParam2],
        gameMode: this.gameModeSelected
      }
    }
    this.router.navigate(['/test-d3js'], extras)
  }

  private paramSafetyCheck() {
    if(!this.graphParam1) this.graphParam1 = 0;
    if(!this.graphParam2) this.graphParam2 = 0;
  }

  isSelected(type) {
    if(type === this.selectedOpponentType || type === this.selectedGraphType) return 'selected'
    else return ''
  }

}
