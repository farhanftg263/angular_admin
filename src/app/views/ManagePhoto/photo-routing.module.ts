import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { PhotoSummaryComponent } from './PhotoSummary.component';
import { PhotoUserDetailComponent } from './PhotoUserDetail.component';
const routes: Routes = [
  {
    path:'',
    data:{
      title : 'Manage Photo'
    },
    children:[
      {
        path: 'summary',
        component: PhotoSummaryComponent,
        data: {
          title: 'Summary'
        }
      },
      {
        path : 'user-detail/:id',
        component : PhotoUserDetailComponent,
        data : {
          title : 'User Detail'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagePhotoRoutingModule {}
