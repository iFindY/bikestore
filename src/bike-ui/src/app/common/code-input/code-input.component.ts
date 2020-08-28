import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, HostListener, OnDestroy } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
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
export class CodeInputComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {

    form: FormGroup;
    cursor: string = '_';
    blur: EventEmitter<any> = new EventEmitter<any>();
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
    }

    ngAfterViewInit(): void {

        this.subscriptions = interval(1100).pipe().subscribe(() => this.cursor = this.cursor === '_' ? '' : '_');

    }

//== == == == has to implement this 4/5 methods

    public onTouched: () => void = () => {
    };

    writeValue(val: any): void {
        val && this.form.setValue(val, { emitEvent: false });
    }

    registerOnChange(fn: any): void {
        this.form.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        isDisabled ? this.form.disable() : this.form.enable();
    }

//== == == == block invalid chars

    @HostListener('keydown', ['$event', '$event.key', '$event.target.id'])
    blockChar(event: KeyboardEvent, key: string, id: string) {
        let index = Number(id);

        if (RegExp(/^[a-zA-Z0-9]$/).test(key)) {
            this.input[index].val = key.toUpperCase();

        } else if (key === 'Delete' || key === 'Backspace') {
            event.preventDefault();

            if (this.input[index].val === '') {
                this.focusLeft(index);
                this.input[--index].val = '';
            } else {
                this.input[index].val = '';
            }

        } else {
            event.preventDefault();
        }

    }

    @HostListener('keyup', ['$event', '$event.key', '$event.target.id'])
    nextChar(event: KeyboardEvent, key: string, id: string) {
        let index = Number(id);

        if (/^[a-zA-Z0-9]$/.test(key) || key === 'ArrowRight') {
            this.focusRight(index);

        } else if (key === 'ArrowLeft') {
            this.focusLeft(index);

        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private focusLeft(currentIndex: number) {
        if (currentIndex != 0) this.elRef.nativeElement.querySelectorAll('input').item(--currentIndex).focus();

    }

    private focusRight(currentIndex: number) {

        if (currentIndex == 3) {
            this.elRef.nativeElement.querySelectorAll('input').item(currentIndex).blur();
            this.blur.emit();

        } else {
            this.elRef.nativeElement.querySelectorAll('input').item(++currentIndex).focus();

        }
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

