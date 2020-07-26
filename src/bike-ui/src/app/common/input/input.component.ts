import { Component, ElementRef, forwardRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR, NgControl,
    ValidationErrors,
    Validator,
    ValidatorFn, Validators
} from '@angular/forms';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [
        {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputComponent),
        multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }]
})
export class InputComponent implements ControlValueAccessor, Validator, OnInit {

    @ViewChild('input') input: ElementRef;
    disabled;

    @Input() type = 'text';
    @Input() isRequired: boolean = false;
    @Input() pattern: string = null;
    @Input() label: string = null;
    @Input() placeholder: string;
    @Input() errorMsg: string;

    @Input() hidden: boolean;
    @Input() hintVisible: boolean;

    hover: boolean = false;
    focus: boolean = false;


    constructor(@Self() public control: NgControl) {
        this.control.valueAccessor = this;
    }

    ngOnInit(){
        const control = this.control.control;
        const validators: ValidatorFn[] = control.validator ? [control.validator] : [];

        if (this.isRequired) validators.push(Validators.required);
        if (this.pattern) validators.push(Validators.pattern(this.pattern));


        control.setValidators(validators);
        control.updateValueAndValidity();
    }

    // Function to call when the rating changes.
    onChange(event) { }

    // Function to call when the input is touched
    onTouched() { }

    // Allows Angular to update the model (value).
    // Update the model and changes needed for the view here.
    writeValue(obj: any): void {this.input.nativeElement.value = obj;}

    // Allows Angular to register a function to call when the model (value) changes.
    // Save the function as a property to call later here.
    registerOnChange(fn: any): void {this.onChange = fn;}
    // Allows Angular to register a function to call when the input has been touched.
    // Save the function as a property to call later here.
    registerOnTouched(fn) {this.onTouched = fn;}

    // Allows Angular to disable the input.
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }


    validate(c: AbstractControl): ValidationErrors {
        const validators: ValidatorFn[] = [];

        if (this.isRequired) validators.push(Validators.required);
        if (this.pattern) validators.push(Validators.pattern(this.pattern));

        return validators;
    }
}
