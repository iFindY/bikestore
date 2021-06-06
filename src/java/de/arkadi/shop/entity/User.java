package de.arkadi.shop.entity;


import de.arkadi.shop.entity.enums.UserRights;
import de.arkadi.shop.entity.types.PsSqlEnumType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.SecondaryTable;
import javax.persistence.SecondaryTables;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;


@Entity
@TypeDef(name = "pgsql_enum", typeClass = PsSqlEnumType.class)
@Table(schema = "security", name = "users")
@SecondaryTables({
    @SecondaryTable(schema = "security", name = "authorities",
        pkJoinColumns = @PrimaryKeyJoinColumn(name = "email", referencedColumnName = "email")) // name is the key of secondary column and  refColName ith the id of the prime table
})
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

    @Column(insertable = false)
    private Boolean activated;

    @Column()
    private String username;


    @Enumerated(EnumType.STRING)
    @Type(type = "pgsql_enum" )
    @Column(columnDefinition = "auths", table = "authorities")
    UserRights authority;


    public User() {
        // hibernate
    }

    // ======================================
    // =          Business methods          =
    // ======================================

    public Integer decreaseAttempts(){
        return this.attempts > 0 ? this.attempts -= 1 : this.attempts;
    }

    public void increaseAttempts(){
        this.attempts = 3;
    }

    // ======================================
    // =          Getters & Setters         =
    // ======================================


    public boolean isActivated() {
        return this.activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public void activate() {
        this.activated = true;
    }

    public boolean isLocked() {
        return attempts < 1;
    }

    public boolean isActive() {
        return attempts > 1;
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

    public User enable() {
        this.enabled = true;
        this.increaseAttempts();
        return this;
    }

    public void disable() {
        this.enabled = false;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public UserRights getAuthority() {
        return authority;
    }

    public String getStringAuthority() {
        return authority.toString();
    }
    public void setAuthority(UserRights authority) {
        this.authority = authority;
    }


   // ======================================
   // =             Builder                =
   // ======================================

    public static final class UserBuilder {

        private final User user;

        private UserBuilder() {
            user = new User();
        }

        public static UserBuilder anUser() {
            return new UserBuilder();
        }

        public UserBuilder withEmail(String email) {
            user.setEmail(email);
            return this;
        }

        public UserBuilder withPassword(String password) {
            user.setPassword(password);
            return this;
        }

        public UserBuilder withAttempts(Integer attempts) {
            user.setAttempts(attempts);
            return this;
        }

        public UserBuilder withEnabled(Boolean enabled) {
            user.setEnabled(enabled);
            return this;
        }

        public UserBuilder withUsername(String username) {
            user.setUsername(username);
            return this;
        }

        public UserBuilder withAuthority(UserRights authority) {
            user.setAuthority(authority);
            return this;
        }

        public User build() {
            return user;
        }
    }
}
