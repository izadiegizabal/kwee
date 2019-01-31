import {Injectable} from '@angular/core';

import {ApiAiClient} from 'api-ai-javascript/es6/ApiAiClient';

import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs';

// Message class for displaying messages in the component
export class Message {
  constructor(public content: string, public sentBy: string, public type: number, public obj: any) {
  }
}

@Injectable()
export class ChatService {

  readonly token = '736fcaf97e434e659f0dcada55651c93';
  readonly client = new ApiAiClient({accessToken: this.token});

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() {
  }

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user', 0, {});
    this.update(userMessage);

    return this.client.textRequest(msg)
      .then(res => {
        console.log(res);
        let speech;
        if (res.result.fulfillment.speech) {
          speech = res.result.fulfillment.speech;
          const botMessage = new Message(speech, 'bot', 0, {});
          this.update(botMessage);
        }

        if (!res.result.fulfillment.speech &&
          res.result.fulfillment.messages !== 'undefined') {
          res.result.fulfillment.messages.forEach((e) => {
              console.log(e);
              switch (e.type) {
                case 0:
                  if (e.speech !== '') {
                    const botSpeech = new Message(e.speech, 'bot', 0, {});
                    this.update(botSpeech);
                  }
                  break;
                case 1:
                  const botCard = new Message(e.title, 'bot', 1, {
                    link: e.buttons[0].postback,
                    button: e.buttons[0].text,
                    img: e.imageUrl,
                    subtitle: e.subtitle
                  });
                  this.update(botCard);
                  break;
                case 2:
                  console.log(e.replies);
                  const botReply = new Message('chips', 'bot', 2, { chips: e.replies });
                  this.update(botReply);
                  /*
                  e.replies.forEach(arr => {
                    if (arr !== '') {
                      const botReply = new Message(arr, 'bot', 2, {});
                      this.update(botReply);
                    }
                  });
                  */
                  break;
              }


            }
          );
        }
      });
  }


  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }

}
