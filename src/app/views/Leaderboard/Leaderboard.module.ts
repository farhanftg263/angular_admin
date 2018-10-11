import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  

import { LeaderboardComponent } from './Leaderboard.component';
import { LeaderboardRoutingModule } from './Leaderboard-routing.module';
 

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    LeaderboardRoutingModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
  ],
  declarations: [ 
    LeaderboardComponent,
  ]
})
export class LeaderboardModule { }
