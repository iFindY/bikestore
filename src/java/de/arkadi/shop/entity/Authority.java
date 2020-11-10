package de.arkadi.shop.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@Entity
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(schema = "SECURITY", name = "AUTHORITIES")
@TypeDef(name = "pgsql_enum", typeClass = PsSqlEnumType.class)
public class Authority {

    public Authority() {

    }

    public Authority(String email, UserRights authority) {
        this.email = email;
        this.authority = authority;
    }

    public enum UserRights {USER, ADMIN, MANAGER;}

    @Id
    String email;

    @Column(nullable = false, columnDefinition = "auths")
    @Type( type = "pgsql_enum" )
    UserRights authority;

}
