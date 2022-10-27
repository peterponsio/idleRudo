import { Component, OnInit } from '@angular/core';
import { IdleService } from './services/idle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  currentTime:number = this.idleService.currentTimeOut.value;

  constructor(
    private idleService:IdleService
  ){}

  ngOnInit(): void {
    this.idleService.initIdle();
    this.idleService.currentTimeOut
    .subscribe(time=>{
      this.currentTime = time
    })
  }

  stopIdle(){
    this.idleService.stopIdle();
  } 

  restartIdle(){
    this.idleService.initIdle();
  }
 
}
