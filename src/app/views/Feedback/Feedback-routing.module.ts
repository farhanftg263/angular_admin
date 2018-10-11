import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { FeedbackComponent } from './Feedback.component';
const routes: Routes = [
  {
    path:'',
    data:{
      title : 'Feedback'
    },
    children:[
      {
        path: 'summary',
        component: FeedbackComponent,
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
export class FeedbackRoutingModule {}
