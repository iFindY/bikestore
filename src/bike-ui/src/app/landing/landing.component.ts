import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit{

  text_1: string = "Wir unterscheiden nicht zwischen E und U. Ob Klassik oder Pop -" +
      "wir helfen Ihnen, Ihren individuellen Wünschen entsprechend, den Weg zu Ihrem " +
      "persönlichen Erfolgserlebnis zu finden. Da das Miteinander beim Musizieren " +
      "in der Regel mehr Freude macht, versuchen wir die Schüler untereinander " +
      "bekannt zu machen und sie zum gemeinsamen musizieren zu motivieren";



  text_2: string = "Jeder hat die Möglichkeit, ganz individuell noch mehr über sein natureigenes " +
      "Instrument Die Stimme zu erfahren und sich mit ihr zu beschäftigen. " +
      "Es ist eine ziemlich aufregende Entdeckungsreise, die man " +
      "gemeinsam mit dem Stimmbildner antritt. Sei es für das Singen im Chor, " +
      "als Mitglied in einer Band oder als Redner auf der Bühne -jeder soll und darf sich dabei " +
      "seiner Stilrichtung widmen";


  windowSize: 'normal' | 'small' | 'phone' = 'normal'
  widthObserver: Observable<BreakpointState> = this.breakpointObserver.observe(['(min-width: 1414px)',  Breakpoints.XSmall]);
  subscriptions: Subscription;

  constructor(public breakpointObserver: BreakpointObserver) {
  }



  ngOnInit(): void {

    this.subscriptions = this.widthObserver.subscribe((state: BreakpointState) => {
      if (state.breakpoints[Breakpoints.XSmall]) {
        this.windowSize = 'phone';
      } else if (state.breakpoints['(min-width: 1414px)']) {
        this.windowSize = 'normal';
      } else {
        this.windowSize = 'small';
      }
    });

  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
