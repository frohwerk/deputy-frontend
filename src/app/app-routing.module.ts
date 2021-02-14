import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationViewComponent } from './applications/application-view/application-view.component';
import { ApplicationsListComponent } from './applications/applications-list/applications-list.component';
import { WatchComponent } from './example/watch/watch.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  { path: 'apps', component: ApplicationsListComponent },
  { path: 'apps/:id', component: ApplicationViewComponent },
  { path: 'watch', component: WatchComponent },
  { path: '**', component: IndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
