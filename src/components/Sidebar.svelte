<script lang="ts">
  import type { User } from '../types/auth';

  interface Props {
    user: User;
    activeTab: string;
    onSelectTab: (tab: string) => void;
    onRequestLogout: () => void;
  }

  let { user, activeTab, onSelectTab, onRequestLogout }: Props = $props();

  const studentMenus = [
    { id: 'overview', label: 'Overview', icon: 'bi-grid-1x2' },
    { id: 'krs', label: 'Study Plan (KRS)', icon: 'bi-journal-check' },
    { id: 'schedule', label: 'Course Schedule', icon: 'bi-calendar3' },
    { id: 'transcript', label: 'Academic Transcript', icon: 'bi-award' },
    { id: 'profile', label: 'Student Profile', icon: 'bi-person-vcard' }
  ];

  const lecturerMenus = [
    { id: 'overview', label: 'Overview', icon: 'bi-speedometer2' },
    { id: 'approval', label: 'KRS Approval', icon: 'bi-check2-square' },
    { id: 'courses', label: 'Assigned Courses', icon: 'bi-journal-bookmark' },
    { id: 'schedule', label: 'Teaching Schedule', icon: 'bi-calendar-week' },
    { id: 'profile', label: 'Lecturer Profile', icon: 'bi-person-workspace' }
  ];

  let currentMenus = $derived(user.role === 'lecturer' ? lecturerMenus : studentMenus);
</script>

<aside class="app-sidebar">
  <!-- Brand -->
  <div class="p-3 border-bottom d-flex align-items-center gap-2">
    <div class="bg-primary text-white rounded p-1 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
      <i class="bi bi-mortarboard-fill"></i>
    </div>
    <div class="lh-1">
      <div class="fw-bold text-dark" style="font-size: 0.95rem;">SIAKAD SiberMu</div>
      <small class="text-muted" style="font-size: 0.7rem;">Cyber Muhammadiyah University</small>
    </div>
  </div>

  <!-- Role Indicator Badge -->
  <div class="px-3 pt-3 pb-1 d-flex align-items-center justify-content-between">
    <span class="badge badge-clean-primary text-uppercase px-2 py-1" style="font-size: 0.68rem; letter-spacing: 0.04em;">
      {user.role}
    </span>
    <small class="text-muted font-monospace" style="font-size: 0.72rem;">{user.identifierNumber}</small>
  </div>

  <!-- Navigation Menu -->
  <div class="sidebar-nav">
    <div class="nav-section-title">Main Menu</div>
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

  <!-- Footer Profile & Log Out Trigger -->
  <div class="sidebar-footer">
    <div class="d-flex align-items-center justify-content-between mb-2">
      <div class="text-truncate me-2">
        <div class="fw-semibold text-dark small text-truncate">{user.name}</div>
        <div class="text-muted" style="font-size: 0.72rem;">{user.department}</div>
      </div>
    </div>
    <button
      type="button"
      class="btn btn-logout-clean btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-1"
      onclick={onRequestLogout}
    >
      <i class="bi bi-box-arrow-right"></i>
      <span>Log Out</span>
    </button>
  </div>
</aside>
