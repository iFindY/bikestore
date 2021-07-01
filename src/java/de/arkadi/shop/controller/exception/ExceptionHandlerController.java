package de.arkadi.shop.controller.exception;

import static java.util.Arrays.stream;
import static java.util.Collections.emptyList;
import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.toList;

import de.arkadi.shop.validation.common.Severity;
import java.util.Collection;
import java.util.List;
import javax.validation.ConstraintViolation;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class ExceptionHandlerController extends ResponseEntityExceptionHandler {


  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
      HttpHeaders headers, HttpStatus status, WebRequest request) {

    List<Error> errors = ex.getBindingResult().getAllErrors().stream()
        .map(Error::new)
        .collect(toList());

    return handleExceptionInternal(ex, errors, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
  }


  @ExceptionHandler(value = { ValidationException.class})
  protected ResponseEntity<Object> handleConflict(RuntimeException ex, WebRequest request) {
    String bodyOfResponse = "validation failed";

    return handleExceptionInternal(ex, bodyOfResponse, new HttpHeaders(), HttpStatus.CONFLICT, request);
  }

  // ======================================
  // =               HELPER               =
  // ======================================

  private static class Error {

    private final String key, value, severity;
    private final Collection<String> fields;

    public Error(ObjectError error) {
      ConstraintViolation constraintViolation = error.unwrap(ConstraintViolation.class);

      this.key = error.getCode();
      this.value = error.getDefaultMessage();

      this.severity = constraintViolation.getConstraintDescriptor().getPayload()
          .contains(Severity.Error.class) ? "ERROR" : "INFO";


      this.fields = nonNull(error.getArguments()) ?
          stream(error.getArguments()).skip(1).map(Object::toString).collect(toList()) :
          emptyList();
    }

    public String getKey() {
      return key;
    }

    public String getValue() {
      return value;
    }

    public  Collection<String> getFields() {
      return fields;
    }

    public String getSeverity() {
      return severity;
    }
  }
}
