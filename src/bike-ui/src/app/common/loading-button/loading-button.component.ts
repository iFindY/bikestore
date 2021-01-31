import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'loading-button',
    templateUrl: './loading-button.component.html',
    styleUrls: ['./loading-button.component.scss'],
    animations: [
        trigger('hidden', [
            state('true', style({ opacity: '0%' })),
            state('false', style({ opacity: '100%' })),
            transition('visible <=> hidden', animate('450ms ease-out'))]),
    ]

})
export class LoadingButtonComponent  {

    @Input() type: string = 'submit';
    @Input() color: ThemePalette = 'primary';
    @Input() tabIndex: number = 0;
    @Input() disabled: boolean;
    @Input() loading: boolean;

    @Output()
    submit: EventEmitter<any> = new EventEmitter();


    constructor() {}

    fire(event: MouseEvent) {
        this.submit.emit(event);
    }

    get animation(): string {
        return this.loading ? 'true' : 'false';
    }
}
