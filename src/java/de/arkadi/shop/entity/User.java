package de.arkadi.shop.entity;


import static de.arkadi.shop.entity.Authority.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.SecondaryTable;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "password" })
@Table(schema = "security", name = "users")
@SecondaryTable(schema = "security", name = "authorities", pkJoinColumns = @PrimaryKeyJoinColumn(name = "email", referencedColumnName = "email"))
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

    @Column(name = "authority",table = "authorities")
    @Enumerated(EnumType.STRING)
    private UserRights authority;

    public User(String email, String password) {
        this.email = email;
        this.password = password;
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

}
