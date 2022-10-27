import { takeUntil} from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { DEFAULT_INTERRUPTSOURCES, Idle, InterruptSource } from '@ng-idle/core';
import { Injectable } from '@angular/core';

import { merge, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class IdleService {

  idleEnd$: Subscription = new Subscription
  idleWarning$: Subscription =  new Subscription

  secondsTimeoutAlert: number = 10

  WARNING_MODAL_ID = 'warning-modal'
  countIdle:number = 1

  endIdleBehaviour = new Subject();

  currentTimeOut = new BehaviorSubject(10);
 
  constructor(
    private idle: Idle,
  ) {}

  initIdle() {
    this.secondsTimeoutAlert = 10
    this.setInterrupts(DEFAULT_INTERRUPTSOURCES)
    this.setIdleTime(10)
    this.setIdleTimeout(10)
    this.watchIdleEnd()
    this.watchIdleTimeout()
    this.watchIdleTimeoutCount()
    setTimeout(() => {
      this.idle.watch()
    }, 2000);
  }

  setIdleTime(seconds: number) {
    //Tiempo en el que se disparara el idle time
    this.idle.setIdle(seconds)
    console.log("iddel time",seconds);
  }

  setIdleTimeout(seconds: number) {
    //Tiempo desde que se dispara el timeout hasta que caduca el idle
    this.idle.setTimeout(seconds)
    console.log("iddel timeout",seconds);
  }

  setInterrupts(interrputs: InterruptSource[]) {
    this.currentTimeOut.next(10)
    this.idle.setInterrupts(interrputs)
  }

  watchIdleEnd() {
    if (this.idleEnd$) {
      this.idleEnd$.unsubscribe()
    }    
    this.idleEnd$ =this.idle.onInterrupt
    .pipe(
      takeUntil(this.endIdleBehaviour)
    )
    .subscribe(res => {
      this.reset();
      console.log("interrupts",res);
    })
  }

  watchIdleTimeout() {
  this.idle.onTimeout
    .pipe(
      takeUntil(this.endIdleBehaviour),
    )
    .subscribe(dataTime => {
    console.log("time out");
    this.currentTimeOut.next(dataTime)
    this.showIdleAlert()
    })
  }

  watchIdleTimeoutCount() {
    this.idle.onTimeoutWarning
      .pipe(
        takeUntil(this.endIdleBehaviour),
      )
      .subscribe(dataTime => {
      console.log("time out time",dataTime);
      this.currentTimeOut.next(dataTime)
      })
    }

  reset() { 
    this.idle.watch()
  }

  stopIdle(){
    this.idle.stop()
  }

  showIdleAlert(){
    this.endIdleBehaviour.next(true)
    window.alert("Tiempo idle")
  }


}