package de.arkadi.shop.entity;

import java.util.Random;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import org.hibernate.id.IncrementGenerator;

@Entity
@Table(schema = "security", name = "verifications")
@NamedQueries({
        @NamedQuery(name = "find_verification_by_mail", query = "SELECT ver FROM Verification ver WHERE ver.email = :mail"),
        @NamedQuery(name = "delete_verification_by_mail", query = "DELETE FROM Verification ver WHERE ver.email = :mail"),
        @NamedQuery(name = "find_user_by_code", query = "SELECT ver FROM Verification ver WHERE ver.code = :code") })
public class Verification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    String id;

    String code;

    @Column(unique = true)
    String email;

    public Verification() {
    }

    public Verification(String email) {
        this.email = email;
        this.code = new Random().nextInt(1000000000) + "";
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
