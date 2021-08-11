import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { bodyExpansion, rotate } from './card.animations';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [bodyExpansion, rotate]
})
export class CardComponent implements OnInit {

    state = 'collapsed';
    mouseover: boolean;
    public image = '';

    @Input() personImage = 'not_found';
    @Input() name;
    @Input() phone;
    @Input() mail;
    @Input() web:string;
    @Input() text;

    constructor() {
    }

    ngOnInit(): void {
    }

    get personImg() {
        return `../../../assets/people${this.personImage}`;
    }

    get avatar() {
        return `background-image: url(${this.personImg})`;
    }

    toggle(): void {
        this.state = (this.state === 'collapsed') ? 'expanded' : 'collapsed';
    }

    mouseOver(e) {
        this.mouseover = e;
    }

    navigate($event: MouseEvent) {
        window.open('https://' + this.web, '_blank');
    }
}
