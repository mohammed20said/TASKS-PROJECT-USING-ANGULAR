import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AdminGuardGuard } from '../core/guards/admin-guard.guard';

const routes: Routes = [
    {
        path:'',
        canActivateChild:[AdminGuardGuard],
        component:LayoutComponent,
        children:[
          {
            path:'tasks', 
            loadChildren: () => import(`./tasks/tasks.module`).then(m => m.TasksModule)
          },
        ]
      },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
