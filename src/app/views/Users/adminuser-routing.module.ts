import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { UserAddComponent } from './UserAdd.component';
import { UserSummaryComponent } from './UserSummary.component';
import { UserEditComponent } from './UserEdit.component';
const routes: Routes = [
  {
    path:'',
    data:{
      title : 'Admin User'
    },
    children:[
      {
        path: 'summary',
        component: UserSummaryComponent,
        data: {
          title: 'Summary'
        }
      },
      {
        path: 'add',
        component: UserAddComponent,
        data: {
          title: 'Add User'
        }
      },
      {
        path: 'edit/:id',
        component: UserEditComponent,
        data: {
          title: 'Edit User'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUserRoutingModule {}
