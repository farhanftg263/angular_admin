import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RedemptionRequestSummaryComponent } from './RedemptionRequestSummary.component';
import { UserDetailComponent } from './UserDetail.component';
import { ProductDetailComponent } from './ProductDetail.component';

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
        component: RedemptionRequestSummaryComponent,
        data: {
          title: 'Summary'
        }
      },     
      {
        path: 'userdetail/:id',
        component: UserDetailComponent,
        data: {
          title: 'User Detail'
        }
      },
      {
        path: 'productdetail/:id',
        component: ProductDetailComponent,
        data: {
          title: 'Product Detail'
        }
      },
    
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedemptionRequestRoutingModule {}
