<script lang="ts">
  import { authStore, REGISTERED_ACCOUNTS } from '../stores/authStore';
  import type { UserRole } from '../types/auth';

  let selectedRole = $state<UserRole>('student');
  let inputId = $state('');
  let inputPass = $state('');
  let showPassword = $state(false);

  let errorMessage = $state('');
  let isLoading = $state(false);

  function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    errorMessage = '';

    if (!inputId.trim() || !inputPass.trim()) {
      errorMessage = 'Please provide your ID Number and Password.';
      return;
    }

    isLoading = true;
    setTimeout(() => {
      const res = authStore.login(inputId, inputPass, selectedRole);
      isLoading = false;
      if (!res.success) {
        errorMessage = res.message;
      }
    }, 250);
  }

  function quickFill(role: UserRole) {
    const account = REGISTERED_ACCOUNTS.find((a) => a.role === role);
    if (account) {
      selectedRole = role;
      inputId = account.identifierNumber;
      inputPass = account.password;
      errorMessage = '';
    }
  }
</script>

<div class="login-wrapper">
  <div class="login-card-simple p-4 p-sm-5">
    <div class="text-center mb-4">
      <div class="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3 shadow-sm" style="width: 52px; height: 52px;">
        <i class="bi bi-mortarboard-fill fs-4"></i>
      </div>
      <h4 class="fw-bold mb-1 text-dark">SIAKAD SiberMu</h4>
      <p class="text-muted small mb-0">Cyber Muhammadiyah University</p>
    </div>

    {#if errorMessage}
      <div class="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3" role="alert">
        <i class="bi bi-exclamation-circle-fill"></i>
        <div class="flex-grow-1">{errorMessage}</div>
      </div>
    {/if}

    <form onsubmit={handleLogin}>
      <!-- Role Selector -->
      <div class="mb-3">
        <label for="roleStudent" class="form-label small fw-semibold text-secondary d-block">
          Account Role
        </label>
        <div class="btn-group w-100" role="group">
          <input
            type="radio"
            class="btn-check"
            name="roleOption"
            id="roleStudent"
            value="student"
            checked={selectedRole === 'student'}
            onchange={() => (selectedRole = 'student')}
          />
          <label class="btn btn-outline-primary btn-sm py-2" for="roleStudent">
            <i class="bi bi-person me-1"></i> Student
          </label>

          <input
            type="radio"
            class="btn-check"
            name="roleOption"
            id="roleLecturer"
            value="lecturer"
            checked={selectedRole === 'lecturer'}
            onchange={() => (selectedRole = 'lecturer')}
          />
          <label class="btn btn-outline-primary btn-sm py-2" for="roleLecturer">
            <i class="bi bi-person-workspace me-1"></i> Lecturer
          </label>
        </div>
      </div>

      <!-- ID Number Input -->
      <div class="mb-3">
        <label for="inputId" class="form-label small fw-semibold text-secondary">
          {selectedRole === 'lecturer' ? 'Lecturer ID (NIDN)' : 'Student ID (NIM)'}
        </label>
        <input
          id="inputId"
          type="text"
          class="form-control"
          placeholder={selectedRole === 'lecturer' ? 'Enter lecturer ID number' : 'Enter student ID number'}
          bind:value={inputId}
          required
        />
      </div>

      <!-- Password Input -->
      <div class="mb-4">
        <label for="inputPass" class="form-label small fw-semibold text-secondary">
          Password
        </label>
        <div class="input-group password-field-group">
          <input
            id="inputPass"
            type={showPassword ? 'text' : 'password'}
            class="form-control"
            placeholder="Enter your password"
            bind:value={inputPass}
            required
          />
          <button
            type="button"
            class="btn-toggle-eye"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onclick={() => (showPassword = !showPassword)}
          >
            <i class={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
          </button>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="btn btn-primary w-100 py-2 fw-semibold"
        disabled={isLoading}
      >
        {#if isLoading}
          <span class="spinner-border spinner-border-sm me-1" role="status"></span>
          Authenticating...
        {:else}
          Sign In
        {/if}
      </button>

      <!-- Quick Demo Login Helpers -->
      <div class="mt-4 pt-3 border-top text-center">
        <div class="text-muted small mb-2" style="font-size: 0.72rem;">
          Registered Accounts (Click to autofill):
        </div>
        <div class="d-flex justify-content-center gap-2">
          <button
            type="button"
            class="btn btn-sm btn-outline-primary py-1 px-2"
            style="font-size: 0.75rem;"
            onclick={() => quickFill('student')}
          >
            <i class="bi bi-person-fill me-1"></i> Student (230101001)
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary py-1 px-2"
            style="font-size: 0.75rem;"
            onclick={() => quickFill('lecturer')}
          >
            <i class="bi bi-person-workspace me-1"></i> Lecturer (0612048501)
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
