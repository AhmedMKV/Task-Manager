package com.taskmanager.dto;

import com.taskmanager.entities.User;
import java.util.Set;
import java.util.stream.Collectors;

public class UserResponseDto {
    private Long id;
    private String username;
    private Set<String> roles;
    private Long taskCount;

    // Constructors
    public UserResponseDto() {
    }

    public UserResponseDto(Long id, String username, Set<String> roles, Long taskCount) {
        this.id = id;
        this.username = username;
        this.roles = roles;
        this.taskCount = taskCount;
    }

    // Static factory method to convert from User entity
    public static UserResponseDto fromUser(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());
        Long taskCount = (long) user.getTasks().size();
        return new UserResponseDto(user.getId(), user.getUsername(), roleNames, taskCount);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public Long getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(Long taskCount) {
        this.taskCount = taskCount;
    }
}

