import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    HostBinding,
    HostListener,
    Injector,
    Input,
    OnInit,
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroupDirective, NG_VALUE_ACCESSOR, NgControl, NgForm } from '@angular/forms';
import {BehaviorSubject, Subject} from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { animate, style, transition, trigger } from '@angular/animations';
import { ErrorStateMatcher } from '@angular/material/core';



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
export class InputComponent implements ControlValueAccessor, OnInit {
    static nextId = 0;

    private _value: string;
    private _placeholder: string;
    private _errorMsg: string;
    private _disabled = false;
    private _required = false;
    private _cState = new BehaviorSubject<boolean>(false);

    autofilled?: boolean;
    control:NgControl;
    stateChanges = new Subject<void>();
    focused: boolean;
    hover: boolean;
    errorMatcher: ErrorStateMatcher;


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
        this.stateChanges.next();
        this.chRef.detectChanges();
    }

    get value() {return this._value;}
    get empty() {return this.value === null || this.value.length > 0;}
    get required() {return this._required;}
    get errorMsg() {return this._errorMsg;}
    get disabled(): boolean {return this._disabled;}
    get placeholder() {return this._placeholder;}


    //======== init ========//

    constructor(private injector: Injector, fm: FocusMonitor, elRef: ElementRef<HTMLElement>,private chRef:ChangeDetectorRef) {

        fm.monitor(elRef.nativeElement, true).subscribe(origin => {
            this.focused = !!origin;
            this.stateChanges.next();});

    }

    ngOnInit(): void {
        this.control = this.injector.get(NgControl, null);
        this.errorMatcher = new CustomFieldErrorMatcher(this.control)
    }


    //======== has to implement this 4 methods ========//

    // takes a value and writes it to the form control element (model/code -> view)
    writeValue(value: any) {this.value = value;} // this.chRef.detectChanges();

    // takes a function that should be called with the value if the value changes in the form control element itself (view -> model)
    registerOnChange(fn: any): void {this.onChange = fn;}
    onChange: Function;

    registerOnTouched(fn) {this.onTouched = fn;}
    onTouched:Function;

    setDisabledState?(isDisabled: boolean): void {this.disabled = isDisabled;}


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
