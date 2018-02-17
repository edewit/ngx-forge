import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateAppComponent } from './create-app/create-app.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { ImportAppComponent } from './import-app/import-app.component';

const routes: Routes = [{
    path: '',
    component: GettingStartedComponent,
    pathMatch: 'full'
  }, {
    path: '_createapp',
    component: CreateAppComponent,
    pathMatch: 'full'
  }, {
    path: '_importapp',
    component: ImportAppComponent,
    pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
