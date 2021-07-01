package de.arkadi.shop.validation.password;


import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;


@Target(TYPE)
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = {EqualPasswordValidator.class})
public @interface EqualPassword {

    String field_1() default "password";
    String field_2() default "confirmedPassword";

    //String message() default "given fields's {field1} and {field2} do not match";
    String message() default "given fields's do not match";

    Class<?>[] groups() default {}; // Add to rest api group

    Class<? extends Payload>[] payload()  default {}; // default error type

}
