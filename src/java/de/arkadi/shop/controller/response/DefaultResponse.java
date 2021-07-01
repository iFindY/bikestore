package de.arkadi.shop.controller.response;

import java.util.Collection;
import java.util.Map;

public class DefaultResponse {

  Collection<String> errors;
  Map<String,String> mappedErrors;

  public DefaultResponse() {
  }

  public DefaultResponse(Collection<String> errors) {
    this.errors = errors;
  }
  public DefaultResponse(Map<String,String> mappedErrors) {
    this.mappedErrors = mappedErrors;
  }

  public Collection<String> getErrors() {
    return errors;
  }

  public Map<String, String> getMappedErrors() {
    return mappedErrors;
  }

  public static final class ResponseBuilder {

    Collection<String> errors;

    private ResponseBuilder() {
    }

    public static ResponseBuilder responseBody() {
      return new ResponseBuilder();
    }

    public ResponseBuilder withErrors(Collection<String> errors) {
      this.errors = errors;
      return this;
    }

    public DefaultResponse build() {
      DefaultResponse defaultResponse = new DefaultResponse();
      defaultResponse.errors = this.errors;
      return defaultResponse;
    }
  }
}
