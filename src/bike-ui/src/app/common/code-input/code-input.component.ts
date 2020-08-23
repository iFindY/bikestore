import { Component, forwardRef, HostListener, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
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
export class CodeInputComponent implements OnInit, ControlValueAccessor {


    form:FormGroup;

    constructor(fb:FormBuilder) {
        this.form = fb.group({ one: '', two: '', three: '', four: '' }, { validator: populated() })
    }

    ngOnInit(): void {}

//== == == == has to implement this 4 methods

    public onTouched: () => void = () => {};

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
    @HostListener('keydown', ['$event', '$event.keyCode', '$event.code', '$event.key'])
    blockChar($event: KeyboardEvent, keycode, code, key) {

        if (!/[a-zA-Z0-9]/.test(key)) $event.preventDefault();
    }

}


//== == == == if server compare request return false input code
export function populated() {
    return (formGroup: FormGroup) => {
        const controls: AbstractControl[] = Object.values(formGroup.controls);
        const untouched = Boolean(controls.find(({ untouched }) => untouched));

        if (untouched) return;

        const populated = controls
            .filter(({ value }) => !Boolean(value))
            .length<=0;

        populated ?
            controls.forEach(c => c.setErrors(null)) :
            controls.forEach(c => c.setErrors({ 'empty': true }));

    }
}

