<script lang="ts">
  import { authStore } from '../stores/authStore';
  import type { UserRole } from '../types/auth';

  let mode = $state<'login' | 'register'>('login');

  // Login inputs
  let loginUser = $state('');
  let loginPass = $state('');
  let showPassword = $state(false);

  // Register inputs
  let regName = $state('');
  let regId = $state('');
  let regEmail = $state('');
  let regPass = $state('');
  let regRole = $state<UserRole>('mahasiswa');
  let regDept = $state('S1 Informatika');

  // Feedback states
  let errorMessage = $state('');
  let successMessage = $state('');
  let isLoading = $state(false);

  function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    errorMessage = '';
    successMessage = '';

    if (!loginUser.trim() || !loginPass.trim()) {
      errorMessage = 'Masukkan NIM/Username dan Kata Sandi.';
      return;
    }

    isLoading = true;
    setTimeout(() => {
      const res = authStore.login(loginUser, loginPass);
      isLoading = false;
      if (!res.success) {
        errorMessage = res.message;
      }
    }, 250);
  }

  function handleRegister(e: SubmitEvent) {
    e.preventDefault();
    errorMessage = '';
    successMessage = '';

    if (!regName.trim() || !regId.trim() || !regPass.trim()) {
      errorMessage = 'Mohon lengkapi Nama, NIM, dan Sandi.';
      return;
    }

    isLoading = true;
    setTimeout(() => {
      const res = authStore.register({
        name: regName,
        identifierNumber: regId,
        email: regEmail.trim() || `${regId.trim()}@sibermu.ac.id`,
        username: regId.trim(),
        password: regPass,
        role: regRole,
        department: regDept
      });

      isLoading = false;
      if (!res.success) {
        errorMessage = res.message;
      }
    }, 250);
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

    <!-- Alert Notifikasi -->
    {#if errorMessage}
      <div class="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3" role="alert">
        <i class="bi bi-exclamation-circle-fill"></i>
        <div class="flex-grow-1">{errorMessage}</div>
      </div>
    {/if}

    {#if successMessage}
      <div class="alert alert-success py-2 px-3 small d-flex align-items-center gap-2 mb-3" role="alert">
        <i class="bi bi-check-circle-fill"></i>
        <div class="flex-grow-1">{successMessage}</div>
      </div>
    {/if}

    <!-- FORM LOGIN -->
    {#if mode === 'login'}
      <form onsubmit={handleLogin}>
        <div class="mb-3">
          <label for="loginUser" class="form-label small fw-semibold text-secondary">
            NIM / Username
          </label>
          <input
            id="loginUser"
            type="text"
            class="form-control"
            placeholder="Masukkan NIM atau username"
            bind:value={loginUser}
            required
          />
        </div>

        <div class="mb-3">
          <label for="loginPass" class="form-label small fw-semibold text-secondary">
            Kata Sandi
          </label>
          <div class="input-group password-field-group">
            <input
              id="loginPass"
              type={showPassword ? 'text' : 'password'}
              class="form-control"
              placeholder="Masukkan kata sandi"
              bind:value={loginPass}
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

        <button
          type="submit"
          class="btn btn-primary w-100 py-2 fw-semibold mt-2"
          disabled={isLoading}
        >
          {#if isLoading}
            <span class="spinner-border spinner-border-sm me-1" role="status"></span>
            Memproses...
          {:else}
            Masuk
          {/if}
        </button>
      </form>

      <div class="text-center mt-4 pt-2 border-top">
        <small class="text-muted">
          Belum punya akun?
          <button
            type="button"
            class="btn btn-link btn-sm p-0 text-decoration-none fw-semibold ms-1"
            onclick={() => { mode = 'register'; errorMessage = ''; }}
          >
            Daftar di sini
          </button>
        </small>
      </div>

    <!-- FORM REGISTER -->
    {:else}
      <form onsubmit={handleRegister}>
        <div class="mb-2">
          <label for="regName" class="form-label small fw-semibold text-secondary">Nama Lengkap</label>
          <input
            id="regName"
            type="text"
            class="form-control form-control-sm"
            placeholder="Nama lengkap..."
            bind:value={regName}
            required
          />
        </div>

        <div class="mb-2">
          <label for="regId" class="form-label small fw-semibold text-secondary">NIM / NIDN</label>
          <input
            id="regId"
            type="text"
            class="form-control form-control-sm"
            placeholder="Nomor induk (digunakan untuk login)..."
            bind:value={regId}
            required
          />
        </div>

        <div class="row g-2 mb-2">
          <div class="col-6">
            <label for="regRole" class="form-label small fw-semibold text-secondary">Peran</label>
            <select id="regRole" class="form-select form-select-sm" bind:value={regRole}>
              <option value="mahasiswa">Mahasiswa</option>
              <option value="dosen">Dosen</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="col-6">
            <label for="regDept" class="form-label small fw-semibold text-secondary">Program Studi</label>
            <select id="regDept" class="form-select form-select-sm" bind:value={regDept}>
              <option value="S1 Informatika">Informatika</option>
              <option value="S1 Sistem Informasi">Sistem Informasi</option>
              <option value="S1 Teknologi Informasi">Teknologi Informasi</option>
            </select>
          </div>
        </div>

        <div class="mb-3">
          <label for="regPass" class="form-label small fw-semibold text-secondary">Kata Sandi</label>
          <div class="input-group password-field-group">
            <input
              id="regPass"
              type={showPassword ? 'text' : 'password'}
              class="form-control form-control-sm"
              placeholder="Buat kata sandi..."
              bind:value={regPass}
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

        <button
          type="submit"
          class="btn btn-success w-100 py-2 fw-semibold"
          disabled={isLoading}
        >
          {#if isLoading}
            <span class="spinner-border spinner-border-sm me-1" role="status"></span>
            Mendaftarkan...
          {:else}
            Daftar & Masuk
          {/if}
        </button>
      </form>

      <div class="text-center mt-3 pt-2 border-top">
        <small class="text-muted">
          Sudah punya akun?
          <button
            type="button"
            class="btn btn-link btn-sm p-0 text-decoration-none fw-semibold ms-1"
            onclick={() => { mode = 'login'; errorMessage = ''; }}
          >
            Masuk sekarang
          </button>
        </small>
      </div>
    {/if}
  </div>
</div>
