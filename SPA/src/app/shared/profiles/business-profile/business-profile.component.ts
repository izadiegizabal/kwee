import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss']
})
export class BusinessProfileComponent implements OnInit {
  business = {
    name: 'Apple',
    kweeIndex: 99,
    bio: 'The Shiba Inu (柴犬) is the smallest of the six original and distinct spitz breeds of dog native to Japan.\n' +
      '\n' +
      'A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting. It looks similar ' +
      'to and is often mistaken for other Japanese dog breeds like the Akita Inu or Hokkaido, but the Shiba Inu is a different breed with' +
      ' a distinct blood line, temperament and smaller size than other Japanese dog breeds.',
    img: 'https://steemitimages.com/DQmcitBuKSUc9hhetXkhSz3Boca9Y2cgVWEaqsMcC6d4Zzb/ryuji-640x640.jpg',
  };

  constructor() {
  }

  ngOnInit() {
  }

}
