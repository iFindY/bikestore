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

    String message() default "password not equal";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}
