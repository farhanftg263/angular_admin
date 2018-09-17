import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CmsAddComponent } from './CmsAdd.component';
import { CmsSummaryComponent } from './CmsSummary.component';
const routes: Routes = [
  {
    path:'',
    data:{
      title : 'CMS'
    },
    children:[
      {
        path: 'summary',
        component: CmsSummaryComponent,
        data: {
          title: 'Summary'
        }
      },
      {
        path: 'add',
        component: CmsAddComponent,
        data: {
          title: 'Add CMS'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule {}
