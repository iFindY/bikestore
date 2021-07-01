import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validator,
  ValidationErrors,
  Validators,
  NG_VALIDATORS,
  FormArray,
  FormControl
} from '@angular/forms';
import {interval, Subscription} from 'rxjs';

@Component({
  // animate interval
  selector: 'code-input',
  templateUrl: './code-input.component.html',
  styleUrls: ['./code-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, // annotation/anker/reference to an array of validators
      useExisting: forwardRef(() => CodeInputComponent),
      multi: true // do not replace but add extra one
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CodeInputComponent),
      multi: true
    }
  ]
})
export class CodeInputComponent implements ControlValueAccessor, Validator, OnDestroy {

  form2: FormGroup;
  form: FormArray;
  cursor: string = '_';

  @Input() tabIndex: number;
  @Output() populated: EventEmitter<Boolean> = new EventEmitter<boolean>();

  subscriptions: Subscription;
  onChangeSubs: Subscription[] = [];

  index: number;
  currentIndex: number = 0;

  touched = false;
  disabled = false;

  onTouched = () => {};
  onChange = () => {};


  constructor(private elRef: ElementRef<HTMLElement>) {

    this.form = new FormArray([
      new FormControl(null, [Validators.required]),
      new FormControl(null, [Validators.required]),
      new FormControl(null, [Validators.required]),
      new FormControl(null, [Validators.required])
    ]);


    this.subscriptions = interval(1000).pipe()
    .subscribe(() => this.cursor = this.cursor === '_' ? '' : '_');
  }

  //====== validation interface

  validate(control: AbstractControl): ValidationErrors {
    return this.form.valid ? null : {invalidForm: {valid: false, message: "code field is invalid"}};
  }

  //== == == == has to implement this 4/5 methods, called by angular forms module only


  writeValue(val: any): void {
    val ? val && this.form.setValue(val, {emitEvent: false}) : this.form.reset();
  }


  registerOnChange(onChange: any): void {
    const sub = this.form.valueChanges.subscribe(onChange);
    this.onChangeSubs.push(sub);
  }


  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

//== == == == block invalid chars

  @HostListener('keydown', ['$event', '$event.key', '$event.target.id'])
  blockChar(event: KeyboardEvent, key: string, id: string) {
    event.preventDefault();
    this.currentIndex = Number(id);

    // on enter code input
    if (RegExp(/^[a-zA-Z0-9]$/).test(key)) {
      // set field value
      this.form.at(this.currentIndex).setValue(key.toUpperCase())
      // go next field
      this.focusRight(this.currentIndex);
      // on delete code input
    } else if (key === 'Delete' || key === 'Backspace') {
      // go left if empty field
      if (!this.form.at(this.currentIndex).value) this.currentIndex = this.focusLeft(this.currentIndex);
      // delete current field value
      this.form.at(this.currentIndex).setValue(null);

      // on input navigation
    } else if (key === 'ArrowRight' || key === 'Tab') {
      this.focusRight(this.currentIndex);

    } else if (key === 'ArrowLeft') {
      this.focusLeft(this.currentIndex);
    }
  }


  @HostListener('keyup', ['$event.key'])
  focusOut(key: string) {
    if (this.currentIndex === 3 && (key !== 'Delete' && key !== 'Backspace')) {
      const codeInputs = this.elRef.nativeElement.querySelectorAll('input');
      codeInputs.item(this.currentIndex).blur();
    }
    this.populated.emit(this.form.valid);
  }


//== == == == helper

  private focusLeft(currentIndex: number): number {
    if (currentIndex != 0) this.elRef.nativeElement.querySelectorAll('input').item(--currentIndex).focus();

    return currentIndex;
  }

  private focusRight(currentIndex: number) {
    const codeInputs = this.elRef.nativeElement.querySelectorAll('input');
    if (currentIndex < 3) codeInputs.item(++currentIndex).focus();
  }


//== == == == on destroy

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.onChangeSubs.forEach(sub => sub.unsubscribe());
  }
}

//== == == == if server compare request return false input code, later asyncValidator

export function populated() {
  return (formGroup: FormGroup) => {
    const controls: AbstractControl[] = Object.values(formGroup.controls);
    const untouched = Boolean(controls.find(({untouched}) => untouched));

    if (untouched) return;
    const populated = controls
    .filter(({value}) => !Boolean(value))
        .length <= 0;

    populated ?
        controls.forEach(c => c.setErrors(null)) :
        controls.forEach(c => c.setErrors({'empty': true}));
  }
}

