import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-sns-share',
  templateUrl: './sns-share.component.html',
  styleUrls: ['./sns-share.component.scss']
})
export class SnsShareComponent implements OnInit {
  modal = false;
  @Input() offer: { title: string, url: string };

  @Input()
  public set isModal(value: boolean) {
    if (value) {
      this.modal = true;
    } else {
      this.modal = false;
    }
  }

  text = '';
  hashtags = 'kwee, joboffer, devjob, newjob';

  constructor(public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.text = `Look what I found at @hellokwee! This offer about ${this.offer.title} looks really promising!`;
  }

  copyToClipboard() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.offer.url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    // Show snackbar
    this.snackBar.open(
      'Link copied to clipboard!',
      'Dismiss',
      {
        duration: 2000
      });
  }

  openNewWindowWithUrl(url: string) {
    window.open(url, '_blank');
  }

  shareInTw() {
    const url = `https://twitter.com/share` +
      `?text=${this.text}` +
      `&url=${this.offer.url}` +
      `&hashtags=${this.hashtags}`;
    this.openNewWindowWithUrl(url);
  }

  shareInFb() {
    const url = `https://www.facebook.com/sharer.php?u=${this.offer.url}`;
    this.openNewWindowWithUrl(url);
  }

  shareInLi() {
    const url = `https://www.linkedin.com/shareArticle?mini=true` +
      `&url=${this.offer.url}` +
      `&title=${this.offer.title}` +
      `&summary=${this.text}` +
      `&source=kwee.ovh`;
    this.openNewWindowWithUrl(url);
  }

  shareInTl() {
    const url = `https://telegram.me/share/url?` +
      `url=${this.offer.url}` +
      `&text=${this.text}`;
    this.openNewWindowWithUrl(url);
  }
}
