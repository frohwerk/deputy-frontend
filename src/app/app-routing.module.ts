import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationViewComponent } from './applications/application-view/application-view.component';
import { ApplicationsListComponent } from './applications/applications-list/applications-list.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  { path: 'apps', component: ApplicationsListComponent },
  { path: 'apps/:id', component: ApplicationViewComponent },
  { path: '**', component: IndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
