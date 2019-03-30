import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-error404',
  templateUrl: './errorPage.component.html',
  styleUrls: ['./errorPage.component.scss']
})
export class ErrorPageComponent implements OnInit {
  gifPaths = [
    {
      '404': [
        '../../../assets/img/error-gifs/collar.gif',
        '../../../assets/img/error-gifs/confusedSad.gif',
        '../../../assets/img/error-gifs/interrogations.gif',
        '../../../assets/img/error-gifs/questions.gif',
        '../../../assets/img/error-gifs/stick.gif',
      ],
      '403': [
        '../../../assets/img/error-gifs/wtf.gif',
        '../../../assets/img/error-gifs/angry.gif',
        '../../../assets/img/error-gifs/angry2.gif',
      ]
    }
  ];

  errorMessages = [
    {
      '403': 'This page is out of your limits, what are you doing here?!',
      '404': 'Sorry the page you were looking for cannot be found.',
    }
  ];

  currentGif = '';
  errorNum = 404;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private titleService: Title) {
    this.errorNum = Number(this.route.snapshot.paramMap.get('errorNum'));
    this.errorNum = (this.gifPaths[0][+this.errorNum]) ? this.errorNum : 404; // if there aren't any gifs for error --> unknown error -> 404
    const currentGifArray = this.gifPaths[0][+this.errorNum];
    this.currentGif = currentGifArray[Math.floor(Math.random() * currentGifArray.length)];
    this.errorMessage = this.errorMessages[0][+this.errorNum];
  }

  ngOnInit() {
    if (this.errorNum) {
      this.titleService.setTitle('Kwee - Error ' + this.errorNum);
    }
  }

  getGif() {
    return this.currentGif;
  }
}
