import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphService } from './_services/graph/graph.service';
import { GameService } from './_services/game/game.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { CommonModule } from '@angular/common';
import { BackendService } from './_services/backend/backend.service';
import { RandomGraphService } from './_services/random-graph/random-graph.service';
import { HttpClientModule } from '@angular/common/http';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { TranslateService } from './_services/translate/translate.service';
import { StatisticService } from './_services/statistic/statistic.service';
import { GameDashboardComponent } from './components/game-dashboard/game-dashboard.component';
import { AdminBoardComponent } from './components/admin/admin-board/admin-board.component';
import { AdminGraphComponent } from './components/admin/admin-graph/admin-graph.component';
import { GraphFileValidatorService } from './_services/graph-file-validator/graph-file-validator.service';
import { GraphConstructorComponent } from './components/graph-constructor/graph-constructor.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';

@NgModule({
  declarations: [
    AppComponent,
    GameMenuComponent,
    GameBoardComponent,
    GameDashboardComponent,
    AdminBoardComponent,
    AdminGraphComponent,
    GraphConstructorComponent,
    TooltipComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    GraphService,
    GameService,
    BackendService,
    RandomGraphService,
    TranslateService,
    StatisticService,
    GraphFileValidatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
