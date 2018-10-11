import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { ContactAdminComponent } from './ContactAdmin.component';
const routes: Routes = [
  {
    path:'',
    data:{
      title : 'Contact Admin'
    },
    children:[
      {
        path: 'summary',
        component: ContactAdminComponent,
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
export class ContactAdminRoutingModule {}
