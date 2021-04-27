import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { City, WeatherArr } from '../../interfaces/interfaces';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  units = ['measurement', 'standard', 'metric', 'imperial'];
  cities: City[] = [
    {name: 'London', id: 1, disabled:false}, 
    {name: 'Haifa',id: 2, disabled:false}, 
    {name: 'Mexico',id: 3, disabled:false}, 
    {name: 'Berlin',id: 4, disabled:false},
    {name: 'kyiv',id: 5, disabled:false},
    {name: 'Antarctica',id: 6, disabled:false}
  ];
  msg: string = '';
  weatherFormGroup: FormGroup = this.fb.group({
    cities: new FormArray([]),
  });
  currentWeather: WeatherArr[] = [];

  constructor(
    private weatherService: WeatherService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    (this.weatherFormGroup.get('cities') as FormArray).push(this.cityGroups());
  }

  cityGroups(): FormGroup {
    return this.fb.group({
      city: new FormControl('', [Validators.required]),
      units: new FormControl('', [Validators.required]),
      result: new FormControl(null)
    });
  }

  addItem(item: AbstractControl): void {
    if (item.valid && this.units.includes(item.value.units)) {
      const params = `${item.value.city.name}&units=${item.value.units}`;
      let cityFind = this.cities.find(city => item.value.city.id == city.id);
      if(cityFind) {
        cityFind.disabled = true;
      }
      
      this.weatherService.getCurrentWeather(params).subscribe(
        (res) => {
          item.get('result')?.setValue(res);
          let weatherFrom = this.weatherFormGroup.get('cities') as FormArray;
          weatherFrom.push(this.cityGroups());
          this.currentWeather.push({
            cityName: item.value.city.name,
            temp: item.value.result.main.temp,
            weather: item.value.result.weather[0].main
          })
        },
        (err) => {
          if (err.error && err.error.message) {
            console.log(err.error.message);
            this.msg = err.error.message;
            return;
          }
        },
        () => {}
      );
    } else {
      item.markAllAsTouched()
    }
  }

  get citiesGroups() {
    return this.weatherFormGroup.get('cities') as FormArray;
  }
}
