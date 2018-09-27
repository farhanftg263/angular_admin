import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagePriceAddComponent } from './ManagePriceAdd.component';
import { ManagePriceSummaryComponent } from './ManagePriceSummary.component';
import { ManagePriceEditComponent } from './ManagePriceEdit.component';
const routes: Routes = [
  {
    path:'',
    data:{
      title : 'Manage Price'
    },
    children:[
      {
        path: 'summary',
        component: ManagePriceSummaryComponent,
        data: {
          title: 'Summary'
        }
      },
      {
        path: 'add',
        component: ManagePriceAddComponent,
        data: {
          title: 'Add Price'
        }
      },
      {
        path: 'edit/:id',
        component: ManagePriceEditComponent,
        data: {
          title: 'Edit Price'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagePriceRoutingModule {}
