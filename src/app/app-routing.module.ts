import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainComponent } from "./pages/app/component";

const routes: Routes = [
  { path: "", redirectTo:'/app', pathMatch: 'full'},
  { path: "app", component: MainComponent },
  { path: '**', redirectTo:'/app', pathMatch: 'full' },  // An attempt to reach any page other than the above will result in a redirect to the home page.
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled", relativeLinkResolution: 'legacy', useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
