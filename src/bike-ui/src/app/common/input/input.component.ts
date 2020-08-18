import { ChangeDetectorRef, Component, ElementRef, forwardRef, HostBinding, HostListener, Injector, Input, } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroupDirective, NG_VALUE_ACCESSOR, NgControl, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
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
export class InputComponent implements ControlValueAccessor {
    static nextId = 0;

    private _value: string;
    private _placeholder: string;
    private _errorMsg: string;
    private _disabled = false;
    private _required = false;

    autofilled?: boolean;
    control:NgControl;
    stateChanges = new Subject<void>();
    focused: boolean;
    hover: boolean;
    errorMatcher: ErrorStateMatcher;


    // == == == == == == error string
    msg1:  string;
    msg2:  string;
    bold1: string;
    bold2: string;
    bold3: string;
    comboWord: string[] = [this.bold1, this.msg1, this.bold2, this.msg2, this.bold3];
    // == == == == == ==

    @Input() label: string = null;
    @Input() icon: string;
    @Input() hidden: boolean;
    @Input() hintVisible: boolean;
    @Input() controlType = 'text';



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



    constructor(private injector: Injector, fm: FocusMonitor, elRef: ElementRef<HTMLElement>,private chRef:ChangeDetectorRef) {

        fm.monitor(elRef.nativeElement, true).subscribe(origin => {
            this.focused = !!origin;
            this.stateChanges.next();});
    }

    ngOnInit(): void {
        this.control = this.injector.get(NgControl, null);
        this.errorMatcher = new CustomFieldErrorMatcher(this.control)
    }


//======= has to implement this 4 methods

    writeValue(value: any) {
        this.value = value;
        console.log(this.value,"ohoho");
        this.chRef.detectChanges();
    }

    onChange: any = () => { };
    registerOnChange(fn: any): void {this.onChange = fn;}

    onTouched: any = () => { };
    registerOnTouched(fn) {this.onTouched = fn;}

    setDisabledState?(isDisabled: boolean): void {this.disabled = isDisabled;}

//======= end

//======= HostBinding


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

    //======= end


    setDescribedByIds(ids: string[]) {
        this.describedBy = ids.join(' ');
    }

    ngOnDestroy() {
        this.stateChanges.complete();
    }

    click(event) {
        if (this.controlType !== 'password') {
            event.stopPropagation();
        } else {
            this.hidden = !this.hidden;
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
