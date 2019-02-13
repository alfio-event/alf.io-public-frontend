import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventDisplayComponent } from './event-display/event-display.component';

const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'event/:eventShortName', component: EventDisplayComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
