import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolesAddComponent } from './RolesAdd.component';
import { RolesSummaryComponent } from './RolesSummary.component';
import { RolesEditComponent } from './RolesEdit.component';
import { RolesPermissionComponent } from './RolesPermission.component';


const routes: Routes = [
  {
    path:'',
    data:{
      title : 'Role'
    },
    children:[
      {
        path: 'summary',
        component: RolesSummaryComponent,
        data: {
          title: 'Summary'
        }
      },
      {
        path: 'add',
        component: RolesAddComponent,
        data: {
          title: 'Add Role'
        }
      },
      {
        path: 'edit/:id',
        component: RolesEditComponent,
        data: {
          title: 'Edit Role'
        }
      },
      {
        path: 'permission/:id',
        component: RolesPermissionComponent,
        data: {
          title: 'Permission Role'
        }
      },
      {
        path: 'summary/delete/:id',
        component: RolesSummaryComponent,
        data: {
          title: 'Delete Role'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {}
