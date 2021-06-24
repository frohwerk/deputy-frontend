import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationCompareComponent } from './applications/application-compare/application-compare.component';
import { ComponentsListComponent } from './components/component-list/components-list.component';
import { ApplicationViewComponent } from './applications/application-view/application-view.component';
import { ApplicationsListComponent } from './applications/applications-list/applications-list.component';
import { EnvironmentEditComponent } from './environments/environment-edit/environment-edit.component';
import { EnvironmentListComponent } from './environments/environment-list/environment-list.component';
import { WatchComponent } from './example/watch/watch.component';
import { IndexComponent } from './index/index.component';
import { PlatformEditComponent } from './platforms/platform-edit/platform-edit.component';
import { ComponentEditComponent } from './components/component-edit/component-edit.component';
import { WorkshopComponent } from './workshop/workshop/workshop.component';
import { LogComponent } from './tasks/log/log.component';

const routes: Routes = [
  { path: 'envs', component: EnvironmentListComponent },
  { path: 'envs/:env', component: EnvironmentEditComponent },
  { path: 'envs/:env/platforms/:platform', component: PlatformEditComponent },
  { path: 'apps', component: ApplicationsListComponent },
  { path: 'apps/:id', component: ApplicationViewComponent },
  { path: 'apps/:id/compare', component: ApplicationCompareComponent },
  { path: 'tasks/:id', component: LogComponent },
  { path: 'components', component: ComponentsListComponent },
  { path: 'components/:id', component: ComponentEditComponent },
  { path: 'watch', component: WatchComponent },
  { path: 'workshop', component: WorkshopComponent },
  { path: 'workshop/:spec', component: WorkshopComponent },
  { path: '**', component: IndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
