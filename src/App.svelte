<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from './stores/authStore';
  import Login from './components/Login.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import Dashboard from './components/Dashboard.svelte';
  import LogoutModal from './components/LogoutModal.svelte';

  const TAB_KEY = 'sibermu_active_tab';

  const studentTabs = ['overview', 'krs', 'schedule', 'transcript', 'profile'];
  const lecturerTabs = ['overview', 'approval', 'courses', 'schedule', 'profile'];

  function getAllowedTabs(role?: string): string[] {
    return role === 'lecturer' ? lecturerTabs : studentTabs;
  }

  function resolveInitialTab(role?: string): string {
    const allowed = getAllowedTabs(role);
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && allowed.includes(hash)) return hash;
      const saved = sessionStorage.getItem(TAB_KEY);
      if (saved && allowed.includes(saved)) return saved;
    }
    return 'overview';
  }

  let isPageLoading = $state(true);
  let activeTab = $state('overview');
  let mobileSidebarOpen = $state(false);
  let showLogoutModal = $state(false);

  $effect(() => {
    if ($authStore.currentUser) {
      const initial = resolveInitialTab($authStore.currentUser.role);
      activeTab = initial;
      if (typeof window !== 'undefined') {
        window.location.hash = initial;
        sessionStorage.setItem(TAB_KEY, initial);
      }
    }
  });

  function handleSelectTab(tab: string) {
    activeTab = tab;
    mobileSidebarOpen = false;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(TAB_KEY, tab);
      window.location.hash = tab;
    }
  }

  function handleConfirmLogout() {
    showLogoutModal = false;
    authStore.logout();
  }

  onMount(() => {
    const timer = setTimeout(() => {
      isPageLoading = false;
    }, 280);

    const handleHash = () => {
      if (!$authStore.currentUser) return;
      const hash = window.location.hash.replace('#', '').trim();
      const allowed = getAllowedTabs($authStore.currentUser.role);
      if (hash && allowed.includes(hash) && hash !== activeTab) {
        activeTab = hash;
        sessionStorage.setItem(TAB_KEY, hash);
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', handleHash);
    };
  });
</script>

{#if !$authStore.isAuthenticated || !$authStore.currentUser}
  <Login />
{:else}
  <div class="app-shell">
    <!-- Sidebar -->
    <div class={mobileSidebarOpen ? 'show' : ''}>
      <Sidebar
        user={$authStore.currentUser}
        {activeTab}
        onSelectTab={handleSelectTab}
        onRequestLogout={() => (showLogoutModal = true)}
      />
    </div>

    <!-- Main Content -->
    <div class="app-main">
      <!-- Topbar Header -->
      <div class="app-topbar d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary d-md-none"
            aria-label="Toggle navigation menu"
            onclick={() => (mobileSidebarOpen = !mobileSidebarOpen)}
          >
            <i class="bi bi-list fs-5"></i>
          </button>
          <div class="fw-bold text-dark d-none d-md-block">
            Cyber Muhammadiyah University
          </div>
          <div class="fw-bold text-dark d-md-none">
            SIAKAD SiberMu
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <span class="badge badge-clean-primary text-uppercase px-2 py-1">
            {$authStore.currentUser.role}
          </span>
          <span class="small text-muted d-none d-sm-inline">
            {$authStore.currentUser.name}
          </span>
        </div>
      </div>

      <!-- Dashboard View -->
      <main class="flex-grow-1 overflow-auto">
        <Dashboard
          user={$authStore.currentUser}
          {activeTab}
          onSelectTab={handleSelectTab}
        />
      </main>
    </div>
  </div>
{/if}

<!-- Logout Confirmation Popup Modal -->
<LogoutModal
  show={showLogoutModal}
  onCancel={() => (showLogoutModal = false)}
  onConfirm={handleConfirmLogout}
/>

<!-- Soft Translucent Page Loader Overlay -->
{#if isPageLoading}
  <div class="app-loader-overlay">
    <div class="app-loader-card text-center">
      <div
        class="spinner-border text-primary mb-2"
        style="width: 2rem; height: 2rem; border-width: 0.2rem;"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="fw-semibold text-dark small">Loading...</div>
    </div>
  </div>
{/if}
