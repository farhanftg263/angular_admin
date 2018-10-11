import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { LeaderboardComponent } from './Leaderboard.component';
const routes: Routes = [
  {
    path:'',
    data:{
      title : 'Leaderboard'
    },
    children:[
      {
        path: 'summary',
        component: LeaderboardComponent,
        data: {
          title: 'Summary'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaderboardRoutingModule {}
