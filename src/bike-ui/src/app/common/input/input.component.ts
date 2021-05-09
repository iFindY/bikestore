import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    HostBinding,
    HostListener,
    Injector,
    Input, OnDestroy,
    OnInit,
} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    FormGroupDirective,
    NG_VALUE_ACCESSOR,
    NgControl,
    NgForm, ValidationErrors,
    Validator
} from '@angular/forms';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { animate, style, transition, trigger } from '@angular/animations';
import { ErrorStateMatcher } from '@angular/material/core';


/**
 * ## Injection
 *  register this component in the angular dependency injection framework,
 *  tell the forms API this component is control value accessor
 *  and can participate in a form. That's why  we need a provider
 *
 *  provide an **NG_VALUE_ACCESSOR** injection token, unique identify a series of injectable in our
 *  dependency injection -system.
 *  Whenever the froms API needs the **list of all the value accessors available**,
 *  it will request all he injection for given injection key
 *
 *  multi: true : add do not ov rewrite existing list
 */
@Component({
    selector: 'custom-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => InputComponent),
        }
    ],
    animations: [
        trigger('hintDrop', [
            transition(':enter', [
                style({ transform: 'translateY(-100%)' }),
                animate('300ms 100ms ease-out',
                    style({ transform: 'translateY(0)' }))])
        ])
    ]
})
export class InputComponent implements ControlValueAccessor, OnInit, OnDestroy {
    static nextId = 0;

    private _value: string;
    private _placeholder: string;
    private _errorMsg: string;
    private _disabled = false;
    private _required = false;
    private _cState = new BehaviorSubject<boolean>(false);

    autofilled?: boolean;
    control: NgControl;
    stateChanges = new Subject<void>();
    focused: boolean;
    hover: boolean;
    errorMatcher: ErrorStateMatcher;
    subscription: Subscription;
    @Input() tabIndex: number;
    @Input() hidden: boolean = true;
    @Input() hintVisible: boolean = true;
    @Input() errorVisible: boolean = true;
    @Input() label: string;
    @Input() icon: string;
    @Input() controlType = 'text';

    @Input() set errorState(err){
        this._cState.next(err);
        this.stateChanges.next();
    };

    @Input() set required(req) {
        this._required = coerceBooleanProperty(req);
        this.stateChanges.next();
    }

    @Input() set placeholder(plh) {
        this._placeholder = plh;
        this.stateChanges.next();
    }
    @Input() set errorMsg(plh) {
        this._errorMsg = plh;
        this.stateChanges.next();
    }
    @Input() set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    set value(value: string | null) {
        this._value = value;
        this.onTouched();
        this.onChange(value);
        this.stateChanges.next(); // trigger onChange life cycle on the component
    }

    get value() {return this._value;}
    get empty() {return this.value === null || this.value.length > 0;}
    get required() {return this._required;}
    get errorMsg() {return this._errorMsg;}
    get disabled(): boolean {return this._disabled;}
    get placeholder() {return this._placeholder;}
    get error() {return this.control.touched && this.control.invalid && this.errorVisible && !this.focused;}

    //== == == == init

    constructor(private injector: Injector, fm: FocusMonitor, elRef: ElementRef<HTMLElement>,private chRef:ChangeDetectorRef) {

        fm.monitor(elRef.nativeElement, true).subscribe(origin => {
            this.focused = !!origin;
            this.stateChanges.next();});

    }

    ngOnInit(): void {
        this.control = this.injector.get(NgControl, null);
        this.errorMatcher = new CustomFieldErrorMatcher(this.control);
        this.subscription = this.stateChanges.asObservable().subscribe(() => this.chRef.detectChanges());
    }



    //== == == == ControlValueAccessor interface

    /**
     * ## ControlValueAccessor interface methods
     *
     * has to implement this 4/5 methods, called by angular forms module only
     *
     *  it is a part of a form, and a form will set values on this control,
     *  and the form will be notified if some of the control values changed.
     *  the form gather information about each control.
     *  each form control will have an control accessors associated to it.
     *
     *  if the form want to set some value it can call the writeValue() method.
     *  the form want be notified if the a new  available by register a call back registerOnChange().
     *
     *  if a control is touched a the control can notify the form about it throughout the callback method.
     *
     *  the form can enable the state for the control to be enabled or disabled
     *
     *  **Methods Descriptions**
     *
     *  1. writeValue:  takes a value and writes it to the form control element (model/code -> view)
     *
     *  2. registerOnChange: takes a function that should be called with the value if the value changes in the form control element itself (view -> model)
     *
     *  3. registerOnTouched:
     */
    onChange = (input: String) => {};
    onTouched= () => {};

    writeValue(value: any) {this.value = value;}

    registerOnChange(callbackFn: any): void {this.onChange = callbackFn;}

    registerOnTouched(callbackFn) {this.onTouched = callbackFn;}

    setDisabledState(isDisabled: boolean): void {this.disabled = isDisabled;}



//== == == == HostBinding

    @HostBinding('attr.aria-describedby') describedBy = '';
    @HostBinding() id = `my-input-${InputComponent.nextId++}`;

    @HostBinding('class.floating')
    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }

    @HostListener('mouseenter') hoverOn() {
        this.hover = true;
        this.stateChanges.next();
    }

    @HostListener('mouseleave') hoverOff() {
        this.hover = false;
        this.stateChanges.next();
    }

//== == == == helper



    setDescribedByIds(ids: string[]) {
        this.describedBy = ids.join(' ');
    }

    ngOnDestroy() {
        this.stateChanges.complete();
        this.subscription.unsubscribe();
    }

    click(event) {
        if (!this.label.toLowerCase().includes('password')) {
            event.stopPropagation();
        } else {
            this.hidden = !this.hidden;
            this.controlType = this.hidden ? 'password' : 'text';
            this.stateChanges.next();
        }
    }

}


class CustomFieldErrorMatcher implements ErrorStateMatcher {
    constructor(private control: NgControl) {
    }

    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return this.control.touched && this.control?.invalid;
    }
}
