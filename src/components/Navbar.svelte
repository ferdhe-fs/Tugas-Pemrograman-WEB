<script lang="ts">
  import { authStore } from '../stores/authStore';
  import type { User } from '../types/auth';

  interface Props {
    user: User;
  }

  let { user }: Props = $props();

  function handleLogout() {
    if (confirm('Apakah Anda yakin ingin keluar dari sistem SIAKAD Siber Muhammadiyah?')) {
      authStore.logout();
    }
  }

  function getBadgeColor(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      case 'dosen':
        return 'bg-success-subtle text-success border border-success-subtle';
      default:
        return 'bg-primary-subtle text-primary border border-primary-subtle';
    }
  }
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2 px-3 px-lg-4 shadow-sm">
  <div class="container-fluid px-0">
    <!-- Brand Siber Muhammadiyah -->
    <a class="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary" href="#dashboard">
      <span class="badge bg-primary text-white p-2 rounded-3">
        <i class="bi bi-mortarboard-fill fs-5"></i>
      </span>
      <div>
        <div class="fs-6 fw-bold tracking-wide text-dark lh-1">SIAKAD SiberMu</div>
        <small class="text-muted fw-normal" style="font-size: 0.7rem;">Universitas Siber Muhammadiyah</small>
      </div>
    </a>

    <!-- Right Controls -->
    <div class="d-flex align-items-center gap-3 ms-auto">
      <!-- User Profile -->
      <div class="d-flex align-items-center gap-2 ps-2">
        <img
          src={user.avatarUrl}
          alt={user.name}
          class="rounded-circle border"
          width="38"
          height="38"
        />
        <div class="d-none d-md-block text-start lh-sm">
          <div class="fw-semibold text-dark small">{user.name}</div>
          <div class="d-flex align-items-center gap-1 mt-1">
            <span class="badge rounded-pill text-uppercase {getBadgeColor(user.role)}" style="font-size: 0.65rem;">
              {user.role}
            </span>
            <span class="text-muted" style="font-size: 0.7rem;">&bull; {user.identifierNumber}</span>
          </div>
        </div>
      </div>

      <!-- Logout Button -->
      <button
        class="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-3 py-1 ms-1"
        onclick={handleLogout}
        title="Keluar dari akun"
      >
        <i class="bi bi-box-arrow-right"></i>
        <span class="d-none d-sm-inline">Logout</span>
      </button>
    </div>
  </div>
</nav>
