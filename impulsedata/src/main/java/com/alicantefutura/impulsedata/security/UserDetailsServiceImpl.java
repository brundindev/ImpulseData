package com.impulsadata.security;

import com.google.api.core.ApiFuture;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        DatabaseReference ref = FirebaseDatabase.getInstance().getReference("users").child(username);
        try {
            ApiFuture<DataSnapshot> future = ref.get();
            DataSnapshot snapshot = future.get();
            if (snapshot.exists()) {
                String user = snapshot.child("username").getValue(String.class);
                String password = snapshot.child("password").getValue(String.class);
                ArrayList<String> roles = (ArrayList<String>) snapshot.child("roles").getValue();
                String[] rolesArray = roles != null ? roles.toArray(new String[0]) : new String[]{"USER"};
                return User.builder().username(user).password(password).roles(rolesArray).build();
            } else {
                throw new UsernameNotFoundException("Usuario no encontrado: " + username);
            }
        } catch (Exception e) {
            throw new UsernameNotFoundException("Error accediendo a Firebase para el usuario: " + username);
        }
    }
}
