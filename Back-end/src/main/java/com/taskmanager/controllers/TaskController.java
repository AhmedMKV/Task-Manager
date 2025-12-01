package com.taskmanager.controllers;

import com.taskmanager.dto.CreateTaskDto;
import com.taskmanager.dto.TaskResponseDto;
import com.taskmanager.dto.UpdateTaskDto;
import com.taskmanager.services.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

     // Get all tasks for the authenticated user
     
    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getUserTasks(Authentication authentication) {
        String username = getUsername(authentication);
        List<TaskResponseDto> tasks = taskService.getUserTasks(username);
        return ResponseEntity.ok(tasks);
    }

     // Create a new task
     
    @PostMapping
    public ResponseEntity<TaskResponseDto> createTask(
            @Valid @RequestBody CreateTaskDto dto,
            Authentication authentication) {
        String username = getUsername(authentication);
        TaskResponseDto task = taskService.createTask(username, dto);
        return ResponseEntity.ok(task);
    }

     // Update a task
     
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDto> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskDto dto,
            Authentication authentication) {
        String username = getUsername(authentication);
        TaskResponseDto task = taskService.updateTask(username, id, dto);
        return ResponseEntity.ok(task);
    }

     // Delete a task
     
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            Authentication authentication) {
        String username = getUsername(authentication);
        taskService.deleteTask(username, id);
        return ResponseEntity.noContent().build();
    }

     // Get task statistics
     
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics(Authentication authentication) {
        String username = getUsername(authentication);
        Map<String, Object> stats = taskService.getTaskStatistics(username);
        return ResponseEntity.ok(stats);
    }

     // Extract username from authentication object
     
    private String getUsername(Authentication authentication) {
        if (authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        }
        return authentication.getName();
    }
}


