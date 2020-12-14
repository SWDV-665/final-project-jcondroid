import { Component } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';

let allScores: Array<string>;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  scores = [
  ]

  constructor() {

  }

  ionViewWillEnter(){
    let data = localStorage.getItem('score');
    this.scores.push(data);
    console.log("Did data load? : ", data);
    // $( "#here" ).load(window.location.href + " #here" );
  }

  loadScores() {
    return this.scores;
  }

  shareScore(score, index) {
    let message = "I just got a score of " + score + "! Think you can beat me?";
    let subject = "Shared via my custom Game App";

    SocialSharing.share(message, subject).then(() => {
      console.log("Shared successfully");
    }).catch((error) => {
      console.error("Error while sharing: ", error);
    });
  }

}
