import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArtifactService } from './artifact/artifact.service';
import { UnassignedPipe } from './artifact/unassigned.pipe';
import { IndexComponent } from './index/index.component';
import { ApplicationsListComponent } from './applications/applications-list/applications-list.component';
import { ApplicationViewComponent } from './applications/application-view/application-view.component';
import { ApplicationEditComponent } from './applications/application-edit/application-edit.component';
import { ComponentListComponent } from './applications/application-edit/component-list/component-list.component';
import { HttpClientModule } from '@angular/common/http';
import { DefaultPipe } from './shared/pipes/default.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WatchComponent } from './example/watch/watch.component';
import { EnvironmentListComponent } from './environments/environment-list/environment-list.component';
import { EnvironmentEditComponent } from './environments/environment-edit/environment-edit.component';
import { OcticonDirective } from './octicon.directive';
import { PlatformListComponent } from './platforms/platform-list/platform-list.component';
import { PlatformEditComponent } from './platforms/platform-edit/platform-edit.component';
import { ApplicationCompareComponent } from './applications/application-compare/application-compare.component';
import { ComponentsListComponent } from './components/component-list/components-list.component';
import { ComponentEditComponent } from './components/component-edit/component-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    ComponentListComponent,
    UnassignedPipe,
    ApplicationEditComponent,
    IndexComponent,
    ApplicationsListComponent,
    ApplicationViewComponent,
    ComponentsListComponent,
    DefaultPipe,
    WatchComponent,
    EnvironmentListComponent,
    EnvironmentEditComponent,
    OcticonDirective,
    PlatformListComponent,
    PlatformEditComponent,
    ApplicationCompareComponent,
    ComponentEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    ArtifactService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
