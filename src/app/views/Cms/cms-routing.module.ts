import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CmsAddComponent } from './CmsAdd.component';
import { CmsSummaryComponent } from './CmsSummary.component';
import { CmsEditComponent } from './CmsEdit.component';
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
      },
      {
        path: 'edit/:id',
        component: CmsEditComponent,
        data: {
          title: 'Edit CMS'
        }
      },
      {
        path: 'summary/delete/:id',
        component: CmsSummaryComponent,
        data: {
          title: 'Delete CMS'
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
