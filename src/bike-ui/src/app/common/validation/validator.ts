import {FormControl, ValidationErrors} from "@angular/forms";


/**
 *
 * const toShort = !(/.[\S]{8,32}$/.test(c.value)) ? null : ["to_short", 'require 8-16 characters'];
 *
 * const oneUpperCase = /[A-Z]/.test(c.value) ? null : ['one_upper_case', ' require one upper case character'];
 *
 * const oneLowerCase = /[a-z]/.test(c.value) ? null : ['one_lower_case', 'require one lowercase  character'];
 *
 * const oneSpecialChar = /[@$!%*?&]/.test(c.value) ? null : ['one_special_char', 'require one special character'];
 *
 * const oneDigit = /[\d]/.test(c.value) ? null : ['one_digit', 'require one digit'];
 *
 */
export class AppValidators {

  static EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  static STRING_LENGTH = /[\S]{8,32}$/;
  static ONE_UPPER_CHAR = /[A-Z]/;
  static ONE_LOWER_CHAR = /[a-z]/;
  static ONE_SPEC_CHAR = /[@$!%*?&"§()=]/;
  static ONE_DIGIT = /[\d]/;


  static required(c: FormControl) {
    return !!c?.value ? null : {required: 'required'}
  }

  static validatePassword(c: FormControl) {
    let result;

    if (!Boolean(c.value)) {
      result = {"validatePassword": 'required'};

    } else if (!(AppValidators.STRING_LENGTH.test(c.value))) {
      result = {"validatePassword": 'require 8-16 characters'};

    } else if (!(AppValidators.ONE_UPPER_CHAR.test(c.value))) {
      result = {'validatePassword': ' require one upper case character'};

    } else if (!(AppValidators.ONE_LOWER_CHAR.test(c.value))) {
      result = {'validatePassword': 'require one lowercase character'};

    } else if (!(AppValidators.ONE_SPEC_CHAR.test(c.value))) {
      result = {'validatePassword': 'require one special character'};

    } else if (!(AppValidators.ONE_DIGIT.test(c.value))) {
      result = {'validatePassword': 'require one digit'};
    }

    return result;
  }

  static email(c: FormControl) {
    let result;

    if (!Boolean(c.value)) {
      result = {'email': 'required'};

    } else if (!AppValidators.EMAIL_REGEXP.test(c.value)) {
      result = {'email': 'invalid email address'};
    }

    return result;
  }



}

