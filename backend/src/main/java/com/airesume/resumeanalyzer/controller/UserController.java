package com.airesume.resumeanalyzer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airesume.resumeanalyzer.dto.LoginRequest;
import com.airesume.resumeanalyzer.dto.LoginResponse;
import com.airesume.resumeanalyzer.model.User;
import com.airesume.resumeanalyzer.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Register User
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {

        System.out.println("========== REGISTER API CALLED ==========");

        return userService.registerUser(user);
    }

    // Login User
    @PostMapping("/login")
    public LoginResponse loginUser(@RequestBody LoginRequest request) {

        System.out.println("========== LOGIN API CALLED ==========");
        System.out.println("Email : " + request.getEmail());

        LoginResponse response = userService.loginUser(request);

        System.out.println("========== LOGIN SUCCESS ==========");

        return response;
    }
}