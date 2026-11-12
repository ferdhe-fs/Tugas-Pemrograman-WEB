<script lang="ts">
  import type { User } from '../types/auth';

  interface Props {
    user: User;
    activeTab: string;
    onSelectTab: (tab: string) => void;
  }

  let { user, activeTab, onSelectTab }: Props = $props();

  const menuItems = [
    { id: 'overview', label: 'Ringkasan / Dashboard', icon: 'bi-grid-1x2-fill' },
    { id: 'krs', label: 'Rencana Studi (KRS)', icon: 'bi-journal-check' },
    { id: 'schedule', label: 'Jadwal Perkuliahan', icon: 'bi-calendar-week' },
    { id: 'profile', label: 'Biodata & Akun', icon: 'bi-person-circle' }
  ];
</script>

<aside class="sidebar p-3">
  <!-- User Card -->
  <div class="p-3 mb-3 bg-light rounded-3 text-center border">
    <img
      src={user.avatarUrl}
      alt={user.name}
      class="rounded-circle border border-2 border-white shadow-sm mb-2"
      width="64"
      height="64"
    />
    <h6 class="fw-bold mb-0 text-truncate">{user.name}</h6>
    <div class="text-muted small text-truncate">{user.department}</div>
    <div class="mt-2">
      <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
        {user.identifierNumber}
      </span>
    </div>
  </div>

  <!-- Navigation Links -->
  <div class="nav flex-column">
    <div class="text-uppercase text-muted fw-bold px-3 mb-2" style="font-size: 0.7rem; letter-spacing: 0.05em;">
      Menu Utama
    </div>
    {#each menuItems as item}
      <button
        type="button"
        class="btn border-0 text-start sidebar-link {activeTab === item.id ? 'active' : ''}"
        onclick={() => onSelectTab(item.id)}
      >
        <i class="bi {item.icon} fs-5"></i>
        <span>{item.label}</span>
      </button>
    {/each}
  </div>

  <div class="mt-4 pt-3 border-top px-3">
    <div class="small text-muted mb-1">Institusi:</div>
    <div class="fw-semibold small text-dark mb-2">Universitas Siber Muhammadiyah</div>
    <div class="badge bg-success-subtle text-success border border-success-subtle w-100 py-2">
      SIAKAD Aktif
    </div>
  </div>
</aside>
