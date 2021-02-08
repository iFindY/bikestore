package de.arkadi.shop.entity;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@Entity
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "password" })
@Table(schema = "security", name = "users")
@NamedQueries({
        @NamedQuery(name = "find_user_by_mail", query = "SELECT user FROM User user WHERE user.email = :mail"),
        @NamedQuery(name = "find_user_by_name", query = "SELECT user FROM User user WHERE user.username = :name")})
public class User {


    @Id
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(insertable = false)
    private Integer attempts;

    @Column(insertable = false)
    private Boolean enabled;

    @Column()
    private String username;


    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public User() {
        // hibernate
    }

    public Integer decreaseAttempts(){
        return this.attempts > 0 ? this.attempts -= 1 : this.attempts;
    }

    public void increaseAttempts(){
        this.attempts = 3;
    }

    public boolean isLocked() {
        return attempts < 1;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getAttempts() {
        return attempts;
    }

    public void setAttempts(Integer attempts) {
        this.attempts = attempts;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}
