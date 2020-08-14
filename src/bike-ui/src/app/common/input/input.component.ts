import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    HostListener, Injector,
    Input, OnInit,
    Optional,
    Self
} from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { animate, style, transition, trigger } from '@angular/animations';
import { ErrorStateMatcher } from '@angular/material/core';

export class CustomFieldErrorMatcher implements ErrorStateMatcher {
    constructor(private customControl: FormControl) { }

    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return this.customControl && this.customControl.touched &&(this.customControl.invalid);
    }
}
@Component({
    selector: 'custom-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: InputComponent
        }],
    animations: [
        trigger('hintDrop', [
            transition(':enter', [
                style({ transform: 'translateY(-100%)' }),
                animate('300ms 100ms ease-out',
                    style({ transform: 'translateY(0)' }))])
        ])
    ]
})
export class InputComponent implements MatFormFieldControl<String>,ControlValueAccessor,AfterViewInit {

    @Input() label: string = null;
    @Input() icon: string;
    @Input() hidden: boolean;
    @Input() hintVisible: boolean;
    control: FormControl

    ngAfterViewInit(): void {
        this.control = this.ngControl.control as FormControl;
    }
    

    errorMatcher() {
        console.log("newe Custom")
        return new CustomFieldErrorMatcher(this.control)
    }

    readonly errorStateMatcher: ErrorStateMatcher = {
        isErrorState: (ctrl: FormControl) => (ctrl && ctrl.invalid)
    };
    /**
     * This property allows someone to set or get the value of our control
     */
    _value: string;
    set value(value: string | null) {
        this._value = value;
        this.stateChanges.next();
    }

    get value() {
        return this._value;
    }

    /**
     * This property allows us to tell the <mat-form-field> what to use as a placeholder.
     */
    private _placeholder: string;

    @Input() get placeholder() {
        return this._placeholder;
    }

    set placeholder(plh) {
        this._placeholder = plh;
        this.stateChanges.next();
    }

    /**
     *  This property allows us to tell the <mat-form-field> what to use as a error message.
     */
    private _errorMsg: string;

    @Input() get errorMsg() {
        return this._errorMsg;
    }

    set errorMsg(plh) {
        this._errorMsg = plh;
        this.stateChanges.next();
    }

    /**
     * Because the <mat-form-field> uses the OnPush change detection strategy,
     * we need to let it know when something happens in the form field control
     * that may require the form field to run change detection.
     *
     * So far the only thing the form field needs to know about is when the value changes.
     * We'll need to emit on the stateChanges stream when that happens,
     */
    stateChanges = new Subject<void>();

    /**
     * This property should return the ID of an element in the component's template
     * */
    static nextId = 0;
    @HostBinding() id = `my-input-${InputComponent.nextId++}`;

    /**
     * This property allows the form field control to specify the @angular/forms control that is bound to this component.
     */
    ngControl: NgControl;

    /**
     * This property indicates whether or not the form field control should be considered to be in a focused state.
     * For the purposes of our component, we want to consider it focused if any of the part inputs are focused.
     */
    focused: boolean;
    hover: boolean;

    /**
     * This property indicates whether the form field control is empty. For our control, we'll consider it empty if all of the parts are empty.
     */
    get empty() {
        return this.value === null || this.value.length > 0;
    }

    /**
     * This property is used to indicate whether the label should be in the floating position.
     * We'll use the same logic as matInput and float the placeholder when the input is focused or non-empty.
     * Since the placeholder will be overlapping our control when when it's not floating,
     * we should hide the – characters when it's not floating.
     */
    @HostBinding('class.floating')
    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }

    /**
     * This property is used to indicate whether the input is required.
     * <mat-form-field> uses this information to add a required indicator to the placeholder.
     * Again, we'll want to make sure we run change detection if the required state changes.
     */
    private _required = false;

    @Input()
    get required() {
        return this._required;
    }

    set required(req) {
        this._required = coerceBooleanProperty(req);
        this.stateChanges.next();
    }

    /**
     * This property tells the form field when it should be in the disabled state.
     * In addition to reporting the right state to the form field,
     * we need to set the disabled state on the individual inputs that make up our component.
     */
    private _disabled = false;

    @Input()
    get disabled(): boolean {
        return this._disabled;
    }

    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this.stateChanges.next();
    }

    /**
     * This property indicates whether the associated NgControl is in an error state.
     * Since we're not using an NgControl in this example,
     * we don't need to do anything other than just set it to false.
     */
    errorState: boolean;

    /**
     * This property allows us to specify a unique string for the type of control in form field.
     * The <mat-form-field> will add an additional class based on this type that can be used to easily apply special styles
     * to a <mat-form-field> that contains a specific type of control.
     * In this example we'll use example-tel-input as our control type which will result in the form field
     * adding the class mat-form-field-example-tel-input
     */
    @Input() controlType = 'text';

    /**
     * This method is used by the <mat-form-field> to specify the IDs that should be used for the aria-describedby attribute of your component.
     * The method has one parameter, the list of IDs, we just need to apply the given IDs to our host element.
     */
    @HostBinding('attr.aria-describedby') describedBy = '';

    setDescribedByIds(ids: string[]) {
        this.describedBy = ids.join(' ');
    }

    /**
     * This method will be called when the form field is clicked on. It allows your component to hook in and handle that click however it wants.
     * The method has one parameter, the MouseEvent for the click.
     * In our case we'll just focus the first <input> if the user isn't about to click an <input> anyways.
     */
    onContainerClick(event: MouseEvent) {
        if ((event.target as Element).tagName.toLowerCase() != 'input') {
            this.elRef.nativeElement.querySelector('input').focus();
        }
    }

    onContainerMouseIn(event: MouseEvent) {
        if ((event.target as Element).tagName.toLowerCase() != 'input') {
            this.elRef.nativeElement.querySelector('input').onmouseenter;
        }
    }

    autofilled?: boolean;

    constructor(@Optional() @Self() ngControl: NgControl,
                fb: FormBuilder,
                private fm: FocusMonitor,
                private elRef: ElementRef<HTMLElement>) {

        // Setting the value accessor directly
        this.ngControl = ngControl;
        this.ngControl.valueAccessor = this;


        // For the purposes of our component, we want to consider it focused if any of the part inputs are focused.
        // We can use the FocusMonitor from @angular/cdk to easily check this.
        fm.monitor(elRef.nativeElement, true).subscribe(origin => {
            this.focused = !!origin;
            this.stateChanges.next();
        });

    }

    ngOnInit(): void {
        this.ngControl.control.statusChanges.subscribe(status => {
            this.errorState = status !== 'VALID';
            console.log( this.errorState);
        });
    }

    ngOnDestroy() {
        this.stateChanges.complete();
    }

    // Function to call when value change
    onChange(event) {
    }

    // Function to call when the input is touched
    onTouched() {
    }

//======= has to implement this 4 methods

    // Allows Angular to update the model (value).
    // Update the model and changes needed for the view here.
    writeValue(value: any) {
        this.value = value;
    }

    // Allows Angular to register a function to call when the model (value) changes.
    // Save the function as a property to call later here.
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    // Allows Angular to register a function to call when the input has been touched.
    // Save the function as a property to call later here.
    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    // Allows Angular to disable the input.
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

//======= end

    @HostListener('mouseenter') onMouseEnter() {
        this.hover = true;
        this.stateChanges.next();
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.hover = false;
        this.stateChanges.next();
    }

    loggg(error: any) {
        console.log("dsfds",error)
    }
}
