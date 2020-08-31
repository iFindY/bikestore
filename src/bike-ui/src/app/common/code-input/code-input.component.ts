import { Component, ElementRef, EventEmitter, forwardRef, HostListener, OnDestroy, Output } from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormBuilder,
    FormGroup,
    NG_VALUE_ACCESSOR
} from '@angular/forms';
import { interval, Subscription } from 'rxjs';

@Component({
    // animate interval
    selector: 'code-input',
    templateUrl: './code-input.component.html',
    styleUrls: ['./code-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CodeInputComponent),
            multi: true
        }
    ]
})
export class CodeInputComponent implements ControlValueAccessor, OnDestroy {

    form: FormGroup;
    cursor: string = '_';

    @Output()
    confirmed: EventEmitter<any> = new EventEmitter<any>();
    subscriptions: Subscription;
    index: number;

    // custom type array, objects to get object reference
    input: { id: number, val: string }[] = [
        { 'id': 0, 'val': '' },
        { 'id': 1, 'val': '' },
        { 'id': 2, 'val': '' },
        { 'id': 3, 'val': '' }
    ];

    constructor(fb: FormBuilder, private elRef: ElementRef<HTMLElement>) {

        this.form = fb.group({ one: '', two: '', three: '', four: '' }, { validator: populated() });
        this.subscriptions = interval(1100).pipe().subscribe(() => this.cursor = this.cursor === '_' ? '' : '_');
    }

//== == == == has to implement this 4/5 methods

    onTouched: () => void = () => {};
    onChange: any = () => { };
    writeValue(val: any): void {val && this.form.setValue(val, { emitEvent: false });}
    registerOnChange(fn: any): void {this.form.valueChanges.subscribe(fn);}
    registerOnTouched(fn: any): void {this.onTouched = fn;}
    setDisabledState?(isDisabled: boolean): void {isDisabled ? this.form.disable() : this.form.enable();}

//== == == == block invalid chars

    @HostListener('keydown', ['$event', '$event.key', '$event.target.id'])
    blockChar(event: KeyboardEvent, key: string, id: string) {
        event.preventDefault();
        let index = Number(id);

        // on enter code input
        if (RegExp(/^[a-zA-Z0-9]$/).test(key)) {
            // set field value
            this.input[index].val = key.toUpperCase();
            // go next field
            this.focusRight(index);

        // on delete code input
        } else if (key === 'Delete' || key === 'Backspace') {
            // go left if empty field
            if (!this.input[index].val) index = this.focusLeft(index);
            // delete current field value
            this.input[index].val = '';

        // on input navigation
        } else if (key === 'ArrowRight') {
            this.focusRight(index);

        } else if (key === 'ArrowLeft') {
            this.focusLeft(index);
        }
    }



//== == == == helper


    private focusLeft(currentIndex: number):number {
        if (currentIndex != 0) this.elRef.nativeElement.querySelectorAll('input').item(--currentIndex).focus();

        return currentIndex;
    }

    private focusRight(currentIndex: number) {
        const codeInputs = this.elRef.nativeElement.querySelectorAll('input');

        if (currentIndex == 3) {
            codeInputs.item(currentIndex).blur();
            this.confirmed.emit(this.form);

        } else {
            codeInputs.item(++currentIndex).focus();
        }
    }


//== == == == on destroy

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}

//== == == == if server compare request return false input code, later asyncValidator
export function populated() {
    return (formGroup: FormGroup) => {
        const controls: AbstractControl[] = Object.values(formGroup.controls);
        const untouched = Boolean(controls.find(({ untouched }) => untouched));

        if (untouched) return;
        const populated = controls
            .filter(({ value }) => !Boolean(value))
            .length <= 0;

        populated ?
            controls.forEach(c => c.setErrors(null)) :
            controls.forEach(c => c.setErrors({ 'empty': true }));

    }
}

