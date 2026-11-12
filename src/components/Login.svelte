<script lang="ts">
  import { authStore, REGISTERED_ACCOUNTS } from '../stores/authStore';
  import type { UserRole } from '../types/auth';

  // Input states
  let selectedRole = $state<UserRole>('mahasiswa');
  let inputNik = $state('');
  let inputPass = $state('');
  let showPassword = $state(false);

  // Feedback states
  let errorMessage = $state('');
  let isLoading = $state(false);

  function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    errorMessage = '';

    if (!inputNik.trim() || !inputPass.trim()) {
      errorMessage = 'Mohon isi NIK / Nomor Induk dan Kata Sandi.';
      return;
    }

    isLoading = true;
    setTimeout(() => {
      const res = authStore.loginWithNikAndRole(inputNik, inputPass, selectedRole);
      isLoading = false;
      if (!res.success) {
        errorMessage = res.message;
      }
    }, 250);
  }

  // Quick fill bantuan pengujian akun terdaftar
  function quickFill(role: UserRole) {
    const account = REGISTERED_ACCOUNTS.find((a) => a.role === role);
    if (account) {
      selectedRole = role;
      inputNik = account.identifierNumber;
      inputPass = account.password;
      errorMessage = '';
    }
  }
</script>

<div class="login-wrapper">
  <div class="login-card-simple p-4 p-sm-5">
    <!-- Header Logo & Kampus -->
    <div class="text-center mb-4">
      <div class="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3 shadow-sm" style="width: 52px; height: 52px;">
        <i class="bi bi-mortarboard-fill fs-4"></i>
      </div>
      <h4 class="fw-bold mb-1 text-dark">SIAKAD SiberMu</h4>
      <p class="text-muted small mb-0">Universitas Siber Muhammadiyah</p>
    </div>

    <!-- Alert Kesalahan -->
    {#if errorMessage}
      <div class="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3" role="alert">
        <i class="bi bi-exclamation-circle-fill"></i>
        <div class="flex-grow-1">{errorMessage}</div>
      </div>
    {/if}

    <!-- FORM LOGIN HANYA NIK & ROLE TERDAFTAR -->
    <form onsubmit={handleLogin}>
      <!-- Pilihan Peran Akun -->
      <div class="mb-3">
        <label for="roleMahasiswa" class="form-label small fw-semibold text-secondary d-block">
          Peran Akun
        </label>
        <div class="btn-group w-100" role="group">
          <input
            type="radio"
            class="btn-check"
            name="roleOption"
            id="roleMahasiswa"
            value="mahasiswa"
            checked={selectedRole === 'mahasiswa'}
            onchange={() => (selectedRole = 'mahasiswa')}
          />
          <label class="btn btn-outline-primary btn-sm py-2" for="roleMahasiswa">
            <i class="bi bi-person me-1"></i> Mahasiswa
          </label>

          <input
            type="radio"
            class="btn-check"
            name="roleOption"
            id="roleDosen"
            value="dosen"
            checked={selectedRole === 'dosen'}
            onchange={() => (selectedRole = 'dosen')}
          />
          <label class="btn btn-outline-primary btn-sm py-2" for="roleDosen">
            <i class="bi bi-person-workspace me-1"></i> Dosen
          </label>
        </div>
      </div>

      <!-- Input NIK / Nomor Induk -->
      <div class="mb-3">
        <label for="inputNik" class="form-label small fw-semibold text-secondary">
          {selectedRole === 'dosen' ? 'NIDN / NIP / NIK Dosen' : 'NIM / NIK Mahasiswa'}
        </label>
        <input
          id="inputNik"
          type="text"
          class="form-control"
          placeholder={selectedRole === 'dosen' ? 'Masukkan NIDN dosen terdaftar' : 'Masukkan NIM mahasiswa terdaftar'}
          bind:value={inputNik}
          required
        />
      </div>

      <!-- Input Kata Sandi -->
      <div class="mb-4">
        <label for="inputPass" class="form-label small fw-semibold text-secondary">
          Kata Sandi
        </label>
        <div class="input-group password-field-group">
          <input
            id="inputPass"
            type={showPassword ? 'text' : 'password'}
            class="form-control"
            placeholder="Masukkan kata sandi"
            bind:value={inputPass}
            required
          />
          <button
            type="button"
            class="btn-toggle-eye"
            aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
            onclick={() => (showPassword = !showPassword)}
          >
            <i class={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
          </button>
        </div>
      </div>

      <!-- Tombol Masuk -->
      <button
        type="submit"
        class="btn btn-primary w-100 py-2 fw-semibold"
        disabled={isLoading}
      >
        {#if isLoading}
          <span class="spinner-border spinner-border-sm me-1" role="status"></span>
          Memverifikasi...
        {:else}
          Masuk ke Sistem
        {/if}
      </button>

      <!-- Informasi Akun Terdaftar untuk Pengujian -->
      <div class="mt-4 pt-3 border-top text-center">
        <div class="text-muted small mb-2" style="font-size: 0.72rem;">
          Akun Terdaftar di Sistem (Klik untuk uji coba):
        </div>
        <div class="d-flex justify-content-center gap-2">
          <button
            type="button"
            class="btn btn-sm btn-outline-primary py-1 px-2"
            style="font-size: 0.75rem;"
            onclick={() => quickFill('mahasiswa')}
          >
            <i class="bi bi-person-fill me-1"></i> Mahasiswa (230101001)
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary py-1 px-2"
            style="font-size: 0.75rem;"
            onclick={() => quickFill('dosen')}
          >
            <i class="bi bi-person-workspace me-1"></i> Dosen (0612048501)
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
