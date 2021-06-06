package de.arkadi.shop.security.event.verification;

import org.springframework.context.ApplicationEvent;

import de.arkadi.shop.entity.User;

public class UserRegistrationEvent extends ApplicationEvent{

    User user;



    public UserRegistrationEvent(User user) {
        super(user);
        this.user = user;
    }

    public User getUser() {
        return user;
    }

}
