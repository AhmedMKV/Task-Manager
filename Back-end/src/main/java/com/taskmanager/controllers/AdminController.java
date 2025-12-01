package com.taskmanager.controllers;

import com.taskmanager.dto.TaskResponseDto;
import com.taskmanager.dto.UserResponseDto;
import com.taskmanager.repositories.UserRepository;
import com.taskmanager.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserRepository userRepository;

     // Get all tasks (Admin only)
     
    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponseDto>> getAllTasks() {
        List<TaskResponseDto> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

     // Get all users (Admin only)
     
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<UserResponseDto> users = userRepository.findAll().stream()
                .map(UserResponseDto::fromUser)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
}


