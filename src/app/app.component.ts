import { Component } from '@angular/core';
import { interval, Subject, observable } from 'rxjs'
import { PubNubAngular } from 'pubnub-angular2';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UUID } from 'angular2-uuid';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sendLocation: any;
  pubnubb: any;
  Data: any;
  keyName: string = 'ClientKey';
  constructor(pubnub: PubNubAngular,
    private deviceService: DeviceDetectorService) {
    pubnub.init({
      publishKey: 'pub-c-28765844-5b7e-4183-824a-c534d918f3de',
      subscribeKey: 'sub-c-80a91b4c-43bd-11e9-b827-4e8ff5d9951b',
      uuid: this.setgetLocalStorageByKey(this.keyName)
    });

    this.sendLocation = interval(10000);
    this.sendLocation = this.sendLocation.subscribe(() => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.Data = {
            Id: this.setgetLocalStorageByKey(this.keyName),
            Position: {
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              speed: position.coords.speed
            },
            Device: this.getDeviceInfo(),
            DeviceType: this.getDeviceType(),
            DeviceName: this.getDeviceName(),
            TimeStamp: new Date()
          };

          pubnub.publish({ channel: 'Mobile_Location', message: JSON.stringify(this.Data) }, (response) => {
            console.log(response);
            console.log(JSON.stringify(this.Data))
          });
        });
      }
    });
  }
  getDeviceInfo() {
    return this.deviceService.getDeviceInfo();
  }
  getDeviceType() {
    return {
      Mobile: this.deviceService.isMobile(),
      Tablet: this.deviceService.isTablet(),
      Desktop: this.deviceService.isDesktop()
    }
  }

  getDeviceName() {
    var dd = this.getDeviceInfo().userAgent;
    return (dd.substring(dd.indexOf("("), dd.indexOf(")")).split(';')[2]).trim()
  }

  setgetLocalStorageByKey(key: string) {
    var d = localStorage.getItem(key);
    if (!!!d) {
      var guid = UUID.UUID();
      localStorage.setItem(key, guid);
      return guid;
    }
    return localStorage.getItem(key);
  }

  getDateTime(date: any) {
    var d = new Date(date);
    return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  }
}