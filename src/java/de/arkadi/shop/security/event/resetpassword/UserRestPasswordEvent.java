package de.arkadi.shop.security.event.resetpassword;

import de.arkadi.shop.entity.User;
import org.springframework.context.ApplicationEvent;

public class UserRestPasswordEvent extends ApplicationEvent{

    User user;

    public UserRestPasswordEvent(User user) {
        super(user);
        this.user = user;
    }

    public User getUser() {
        return user;
    }

}
