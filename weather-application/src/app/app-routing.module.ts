import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherComponent } from './core/components/weather/weather.component';

const routes: Routes = [
 {path: 'checkWeather', component: WeatherComponent},
 {path: '*', component: WeatherComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
