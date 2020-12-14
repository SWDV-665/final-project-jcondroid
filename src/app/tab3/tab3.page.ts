import { Component } from '@angular/core';

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

  shareScore() {

  }

}
