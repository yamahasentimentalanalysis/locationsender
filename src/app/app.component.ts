import { Component } from '@angular/core';
import { interval, Subject, observable } from 'rxjs'
import { PubNubAngular } from 'pubnub-angular2';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sendLocation: any;
  pubnubb: any;
  Data: any;
  constructor(pubnub: PubNubAngular,
    private deviceService: DeviceDetectorService) { 
    pubnub.init({
      publishKey: 'pub-c-28765844-5b7e-4183-824a-c534d918f3de',
      subscribeKey: 'sub-c-80a91b4c-43bd-11e9-b827-4e8ff5d9951b' });

    this.sendLocation = interval(10000);
    this.sendLocation = this.sendLocation.subscribe(() => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.Data = {
            Position: {
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              speed: position.coords.speed
            },
            Device: this.getDeviceInfo()
          };
          pubnub.publish({ channel: 'Mobile_Location', message: JSON.stringify(this.Data) }, (response) => {
            console.log(response);
          });
        });
      }
    });
  }

  getLocation() {

  }

  getDeviceInfo() {
    return this.deviceService.getDeviceInfo();
  }
}