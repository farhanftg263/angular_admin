import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductAddComponent } from './ProductAdd.component';
import { ProductSummaryComponent } from './ProductSummary.component';
import { ProductEditComponent } from './ProductEdit.component';
const routes: Routes = [
  {
    path:'',    
    data:{
      title : 'Product',
      url:'summary',
    },
    children:[
      {
        path: 'summary',
        component: ProductSummaryComponent,
        data: {
          title: 'Summary'
        }
      },
      {
        path: 'add',
        component: ProductAddComponent,
        data: {
          title: 'Add Product'
        }
      },
      {
        path: 'edit/:id',
        component: ProductEditComponent,
        data: {
          title: 'Edit Product'
        }
      },
      {
        path: 'summary/delete/:id',
        component: ProductSummaryComponent,
        data: {
          title: 'Delete Product'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
