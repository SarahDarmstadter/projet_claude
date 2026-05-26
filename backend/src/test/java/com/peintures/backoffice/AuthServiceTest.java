package com.peintures.backoffice;

import com.peintures.backoffice.model.AdminUser;
import com.peintures.backoffice.repository.AdminUserRepository;
import com.peintures.backoffice.repository.RefreshTokenRepository;
import com.peintures.backoffice.security.JwtProvider;
import com.peintures.backoffice.service.AuthService;
import com.peintures.backoffice.service.MfaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AdminUserRepository adminUserRepository;
    @Mock
    private RefreshTokenRepository refreshTokenRepository;
    @Mock
    private MfaService mfaService;
    @Mock
    private JwtProvider jwtProvider;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(4);

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "passwordEncoder", passwordEncoder);
        ReflectionTestUtils.setField(authService, "maxFailedAttempts", 5);
        ReflectionTestUtils.setField(authService, "lockoutMinutes", 15);
        ReflectionTestUtils.setField(authService, "refreshTokenExpiryMs", 604800000L);
    }

    @Test
    void login_withValidCredentials_sendsMfaCode() {
        AdminUser user = makeUser("admin@example.com", passwordEncoder.encode("ValidPass1!"));
        when(adminUserRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));
        when(adminUserRepository.save(any())).thenReturn(user);

        AuthService.Step1Result result = authService.initiateLogin("admin@example.com", "ValidPass1!");

        assertThat(result).isEqualTo(AuthService.Step1Result.MFA_SENT);
        verify(mfaService).sendCode(user);
    }

    @Test
    void login_withWrongPassword_returnsInvalidCredentials() {
        AdminUser user = makeUser("admin@example.com", passwordEncoder.encode("ValidPass1!"));
        when(adminUserRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));
        when(adminUserRepository.save(any())).thenReturn(user);

        AuthService.Step1Result result = authService.initiateLogin("admin@example.com", "WrongPass!");

        assertThat(result).isEqualTo(AuthService.Step1Result.INVALID_CREDENTIALS);
        verify(mfaService, never()).sendCode(any());
    }

    @Test
    void login_withUnknownEmail_returnsInvalidCredentials() {
        when(adminUserRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        AuthService.Step1Result result = authService.initiateLogin("unknown@example.com", "any");

        assertThat(result).isEqualTo(AuthService.Step1Result.INVALID_CREDENTIALS);
    }

    @Test
    void login_withLockedAccount_returnsAccountLocked() {
        AdminUser user = makeUser("admin@example.com", passwordEncoder.encode("ValidPass1!"));
        user.setLockedUntil(Instant.now().plusSeconds(900));
        when(adminUserRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));

        AuthService.Step1Result result = authService.initiateLogin("admin@example.com", "ValidPass1!");

        assertThat(result).isEqualTo(AuthService.Step1Result.ACCOUNT_LOCKED);
    }

    @Test
    void login_failedAttempts_locksAccountAfterMax() {
        AdminUser user = makeUser("admin@example.com", passwordEncoder.encode("ValidPass1!"));
        user.setFailedAttempts(4);
        when(adminUserRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(user));
        when(adminUserRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        authService.initiateLogin("admin@example.com", "WrongPass!");

        assertThat(user.getLockedUntil()).isNotNull();
        assertThat(user.getLockedUntil()).isAfter(Instant.now());
    }

    private AdminUser makeUser(String email, String passwordHash) {
        AdminUser u = new AdminUser();
        u.setEmail(email);
        u.setPasswordHash(passwordHash);
        return u;
    }
}
