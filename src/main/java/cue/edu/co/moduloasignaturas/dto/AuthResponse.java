package cue.edu.co.moduloasignaturas.dto;

import cue.edu.co.moduloasignaturas.model.Role;

public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private UserInfo user;

    public AuthResponse(String accessToken, UserInfo user) {
        this.accessToken = accessToken;
        this.user = user;
    }

    // Getters y setters
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    // Clase interna para información del usuario
    public static class UserInfo {
        private String id;
        private String username;
        private String email;
        private String nombre;
        private String apellido;
        private Role role;

        public UserInfo(String id, String username, String email, String nombre, String apellido, Role role) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.nombre = nombre;
            this.apellido = apellido;
            this.role = role;
        }

        // Getters y setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }

        public String getApellido() { return apellido; }
        public void setApellido(String apellido) { this.apellido = apellido; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
    }
}