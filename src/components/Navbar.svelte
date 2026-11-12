<script lang="ts">
  import { authStore } from '../stores/authStore';
  import type { User } from '../types/auth';

  interface Props {
    user: User;
  }

  let { user }: Props = $props();

  function handleLogout() {
    if (confirm('Keluar dari sistem?')) {
      authStore.logout();
    }
  }
</script>

<header class="app-navbar sticky-top">
  <div class="container">
    <div class="d-flex align-items-center justify-content-between">
      <!-- Brand Minimalis -->
      <div class="d-flex align-items-center gap-2">
        <div class="bg-primary text-white rounded p-1 d-flex align-items-center justify-content-center" style="width: 28px; height: 28px;">
          <i class="bi bi-mortarboard-fill small"></i>
        </div>
        <div>
          <span class="fw-bold text-dark">SIAKAD SiberMu</span>
          <span class="text-muted small d-none d-sm-inline ms-1">&bull; Universitas Siber Muhammadiyah</span>
        </div>
      </div>

      <!-- User Info & Logout -->
      <div class="d-flex align-items-center gap-3">
        <div class="d-none d-sm-block text-end lh-sm">
          <div class="fw-semibold text-dark small">{user.name}</div>
          <div class="text-muted" style="font-size: 0.75rem;">{user.identifierNumber} &bull; <span class="text-capitalize">{user.role}</span></div>
        </div>

        <button
          type="button"
          class="btn btn-logout-clean btn-sm px-3 py-1"
          onclick={handleLogout}
        >
          Keluar
        </button>
      </div>
    </div>
  </div>
</header>
