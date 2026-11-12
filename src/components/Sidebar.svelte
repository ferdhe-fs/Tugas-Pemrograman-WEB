<script lang="ts">
  import { authStore } from '../stores/authStore';
  import type { User } from '../types/auth';

  interface Props {
    user: User;
    activeTab: string;
    onSelectTab: (tab: string) => void;
  }

  let { user, activeTab, onSelectTab }: Props = $props();

  // Menu Mahasiswa
  const studentMenus = [
    { id: 'overview', label: 'Ringkasan Studi', icon: 'bi-grid-1x2' },
    { id: 'krs', label: 'Rencana Studi (KRS)', icon: 'bi-journal-check' },
    { id: 'schedule', label: 'Jadwal Kuliah', icon: 'bi-calendar3' },
    { id: 'grades', label: 'Transkrip Nilai (KHS)', icon: 'bi-award' },
    { id: 'profile', label: 'Biodata Mahasiswa', icon: 'bi-person-vcard' }
  ];

  // Menu Dosen
  const lecturerMenus = [
    { id: 'overview', label: 'Ringkasan Mengajar', icon: 'bi-speedometer2' },
    { id: 'approval', label: 'Validasi KRS Mahasiswa', icon: 'bi-check2-square' },
    { id: 'courses', label: 'Mata Kuliah Diampu', icon: 'bi-journal-bookmark' },
    { id: 'schedule', label: 'Jadwal Mengajar', icon: 'bi-calendar-week' },
    { id: 'profile', label: 'Profil & NIDN', icon: 'bi-person-workspace' }
  ];

  // Menu Administrator
  const adminMenus = [
    { id: 'overview', label: 'Ringkasan Sistem', icon: 'bi-pie-chart' },
    { id: 'approval', label: 'Semua Data KRS', icon: 'bi-card-checklist' },
    { id: 'profile', label: 'Profil Administrator', icon: 'bi-shield-check' }
  ];

  let currentMenus = $derived(
    user.role === 'dosen'
      ? lecturerMenus
      : user.role === 'admin'
        ? adminMenus
        : studentMenus
  );

  let roleLabel = $derived(
    user.role === 'dosen'
      ? 'Portal Dosen'
      : user.role === 'admin'
        ? 'Portal BAA'
        : 'Portal Mahasiswa'
  );

  function handleLogout() {
    if (confirm('Keluar dari sesi SIAKAD?')) {
      authStore.logout();
    }
  }
</script>

<aside class="app-sidebar">
  <!-- Brand & Identitas Kampus -->
  <div class="p-3 border-bottom d-flex align-items-center gap-2">
    <div class="bg-primary text-white rounded p-1 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
      <i class="bi bi-mortarboard-fill"></i>
    </div>
    <div class="lh-1">
      <div class="fw-bold text-dark" style="font-size: 0.95rem;">SIAKAD SiberMu</div>
      <small class="text-muted" style="font-size: 0.7rem;">Universitas Siber Muhammadiyah</small>
    </div>
  </div>

  <!-- Role Subheader -->
  <div class="px-3 pt-3 pb-1 d-flex align-items-center justify-content-between">
    <span class="badge badge-clean-primary text-uppercase px-2 py-1" style="font-size: 0.68rem; letter-spacing: 0.04em;">
      {roleLabel}
    </span>
    <small class="text-muted font-monospace" style="font-size: 0.72rem;">{user.identifierNumber}</small>
  </div>

  <!-- Menu Navigasi Sesuai Role -->
  <div class="sidebar-nav">
    <div class="nav-section-title">Menu Utama</div>
    {#each currentMenus as item}
      <button
        type="button"
        class="sidebar-btn {activeTab === item.id ? 'active' : ''}"
        onclick={() => onSelectTab(item.id)}
      >
        <i class="bi {item.icon}"></i>
        <span>{item.label}</span>
      </button>
    {/each}
  </div>

  <!-- Footer Profil User & Tombol Keluar -->
  <div class="sidebar-footer">
    <div class="d-flex align-items-center justify-content-between mb-2">
      <div class="text-truncate me-2">
        <div class="fw-semibold text-dark small text-truncate">{user.name}</div>
        <div class="text-muted" style="font-size: 0.72rem;">{user.department}</div>
      </div>
    </div>
    <button
      type="button"
      class="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-1"
      onclick={handleLogout}
    >
      <i class="bi bi-box-arrow-right"></i>
      <span>Keluar</span>
    </button>
  </div>
</aside>
