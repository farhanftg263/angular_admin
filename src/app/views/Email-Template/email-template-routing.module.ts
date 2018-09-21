import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailTemplateAddComponent } from './EmailTemplateAdd.component';
import { EmailTemplateSummaryComponent } from './EmailTemplateSummary.component';
import { EmailTemplateEditComponent } from './EmailTemplateEdit.component';
const routes: Routes = [
  {
    path:'',
    data:{
      title : 'Email Template'
    },
    children:[
      {
        path: 'summary',
        component: EmailTemplateSummaryComponent,
        data: {
          title: 'Summary'
        }
      },
      {
        path: 'add',
        component: EmailTemplateAddComponent,
        data: {
          title: 'Add Email Template'
        }
      },
      {
        path: 'edit/:id',
        component: EmailTemplateEditComponent,
        data: {
          title: 'Edit Email Template'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailTemplateRoutingModule {}
