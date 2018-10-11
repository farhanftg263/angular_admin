import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { AppUserAddComponent } from './AppUserAdd.component';
import { AppUserSummaryComponent } from './AppUserSummary.component';
import { AppUserEditComponent } from './AppUserEdit.component';
import { AppUserDetailComponent } from './AppUserDetail.component';

const routes: Routes = [
  {
    path:'',
    data:{
      title : 'App User'
    },
    children:[
      {
        path: 'summary',
        component: AppUserSummaryComponent,
        data: {
          title: 'Summary'
        }
      },
      {
        path: 'add',
        component: AppUserAddComponent,
        data: {
          title: 'Add User'
        }
      },
      {
        path: 'edit/:id',
        component: AppUserEditComponent,
        data: {
          title: 'Edit User'
        }
      },
      {
        path: 'detail/:id',
        component: AppUserDetailComponent,
        data: {
          title: 'Detail User'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppUserRoutingModule {}
