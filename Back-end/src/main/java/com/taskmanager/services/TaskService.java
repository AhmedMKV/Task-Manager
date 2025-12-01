package com.taskmanager.services;

import com.taskmanager.dto.CreateTaskDto;
import com.taskmanager.dto.TaskResponseDto;
import com.taskmanager.dto.UpdateTaskDto;
import com.taskmanager.entities.Task;
import com.taskmanager.entities.User;
import com.taskmanager.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

     // Get all tasks for a specific user
     
    @Transactional(readOnly = true)
    public List<TaskResponseDto> getUserTasks(String username) {
        User user = userService.findByUsername(username);
        List<Task> tasks = taskRepository.findByUser(user);
        return tasks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

     // Get all tasks (Admin only)
     
    @Transactional(readOnly = true)
    public List<TaskResponseDto> getAllTasks() {
        List<Task> tasks = taskRepository.findAllByOrderByCreatedAtDesc();
        return tasks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

     // Create a new task for a user
     
    @Transactional
    public TaskResponseDto createTask(String username, CreateTaskDto dto) {
        User user = userService.findByUsername(username);
        Task task = new Task(dto.getTitle(), dto.getDescription(), user);
        
        // Set priority
        if (dto.getPriority() != null && !dto.getPriority().isEmpty()) {
            try {
                task.setPriority(Task.Priority.valueOf(dto.getPriority().toUpperCase()));
            } catch (IllegalArgumentException e) {
                task.setPriority(Task.Priority.MEDIUM);
            }
        }
        
        // Set due date
        if (dto.getDueDate() != null && !dto.getDueDate().isEmpty()) {
            try {
                LocalDateTime dueDate = LocalDateTime.parse(dto.getDueDate(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                task.setDueDate(dueDate);
            } catch (Exception e) {
                // Invalid date format, skip
            }
        }
        
        // Set category
        if (dto.getCategory() != null && !dto.getCategory().isEmpty()) {
            task.setCategory(dto.getCategory());
        }
        
        task = taskRepository.save(task);
        return convertToDto(task);
    }

     // Update a task (only if user owns it or is admin)
     
    @Transactional
    public TaskResponseDto updateTask(String username, Long taskId, UpdateTaskDto dto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        // Get current user
        User currentUser = userService.findByUsername(username);
        
        // Check if user owns the task or is admin
        boolean isOwner = task.getUser().getUsername().equals(username);
        boolean isAdmin = currentUser.getRoles().contains(User.Role.ADMIN);
        
        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You don't have permission to update this task");
        }

        // Update task fields
        if (dto.getTitle() != null) {
            task.setTitle(dto.getTitle());
        }
        if (dto.getDescription() != null) {
            task.setDescription(dto.getDescription());
        }
        if (dto.getCompleted() != null) {
            task.setCompleted(dto.getCompleted());
        }
        if (dto.getPriority() != null && !dto.getPriority().isEmpty()) {
            try {
                task.setPriority(Task.Priority.valueOf(dto.getPriority().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Invalid priority, skip
            }
        }
        if (dto.getDueDate() != null && !dto.getDueDate().isEmpty()) {
            try {
                LocalDateTime dueDate = LocalDateTime.parse(dto.getDueDate(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                task.setDueDate(dueDate);
            } catch (Exception e) {
                // Invalid date format, skip
            }
        }
        if (dto.getCategory() != null) {
            task.setCategory(dto.getCategory());
        }

        task = taskRepository.save(task);
        return convertToDto(task);
    }

     // Delete a task 
     
    @Transactional
    public void deleteTask(String username, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        // Get current user
        User currentUser = userService.findByUsername(username);
        
        // Check if user owns the task or is admin
        boolean isOwner = task.getUser().getUsername().equals(username);
        boolean isAdmin = currentUser.getRoles().contains(User.Role.ADMIN);
        
        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You don't have permission to delete this task");
        }

        taskRepository.delete(task);
    }

     // Get task statistics for a user
     
    @Transactional(readOnly = true)
    public Map<String, Object> getTaskStatistics(String username) {
        User user = userService.findByUsername(username);
        List<Task> tasks = taskRepository.findByUser(user);
        
        long total = tasks.size();
        long completed = tasks.stream().filter(Task::getCompleted).count();
        long pending = total - completed;
        long overdue = tasks.stream()
                .filter(t -> !t.getCompleted() && t.getDueDate() != null && t.getDueDate().isBefore(LocalDateTime.now()))
                .count();
        
        Map<String, Long> priorityCount = tasks.stream()
                .filter(t -> t.getPriority() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getPriority().name(),
                        Collectors.counting()
                ));
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("completed", completed);
        stats.put("pending", pending);
        stats.put("overdue", overdue);
        stats.put("completionRate", total > 0 ? (completed * 100.0 / total) : 0.0);
        stats.put("priorityCount", priorityCount);
        
        return stats;
    }

     // Convert Task entity to TaskResponseDto
     
    private TaskResponseDto convertToDto(Task task) {
        return new TaskResponseDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getCompleted(),
                task.getPriority() != null ? task.getPriority().name() : null,
                task.getDueDate(),
                task.getCategory(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                task.getUser().getUsername()
        );
    }
}

