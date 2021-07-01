package de.arkadi.shop.controller.response;

import java.util.Set;

public class Message {

  String message;
  String username;
  Type type;
  Set<String> roles;


  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  public Set<String> getRoles() {
    return roles;
  }

  public void setRoles(Set<String> roles) {
    this.roles = roles;
  }


  // ======================================
  // =                BUILDER             =
  // ======================================


  public static final class MessageBuilder {

    private Message message;

    private MessageBuilder() {
      message = new Message();
    }

    public static MessageBuilder aMessage() {
      return new MessageBuilder();
    }

    public MessageBuilder withMessage(String text) {
      message.setMessage(text);
      return this;
    }

    public MessageBuilder withUser(String user) {
      message.setUsername(user);
      return this;
    }

    public MessageBuilder withType(Type type) {
      message.setType(type);
      return this;
    }

    public MessageBuilder withRoles(Set<String> roles) {
      message.setRoles(roles);
      return this;
    }

    public Message build() {
      return message;
    }
  }

}
