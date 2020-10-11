import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
    selector: 'loading-button',
    templateUrl: './loading-button.component.html',
    styleUrls: ['./loading-button.component.scss']
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
}
