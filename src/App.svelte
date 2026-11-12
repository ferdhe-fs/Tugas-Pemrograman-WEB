<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from './stores/authStore';
  import Login from './components/Login.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import Dashboard from './components/Dashboard.svelte';

  const TAB_STORAGE_KEY = 'sibermu_active_tab';

  const studentAllowedTabs = ['overview', 'krs', 'schedule', 'grades', 'profile'];
  const lecturerAllowedTabs = ['overview', 'approval', 'courses', 'schedule', 'profile'];
  const adminAllowedTabs = ['overview', 'approval', 'profile'];

  function getAllowedTabs(role?: string): string[] {
    if (role === 'dosen') return lecturerAllowedTabs;
    if (role === 'admin') return adminAllowedTabs;
    return studentAllowedTabs;
  }

  function resolveInitialTab(role?: string): string {
    const allowed = getAllowedTabs(role);
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && allowed.includes(hash)) {
        return hash;
      }
      const saved = sessionStorage.getItem(TAB_STORAGE_KEY);
      if (saved && allowed.includes(saved)) {
        return saved;
      }
    }
    return 'overview';
  }

  let activeTab = $state('overview');
  let mobileSidebarOpen = $state(false);

  // Re-evaluasi tab saat status user termuat / berubah role
  $effect(() => {
    if ($authStore.currentUser) {
      const initial = resolveInitialTab($authStore.currentUser.role);
      activeTab = initial;
      if (typeof window !== 'undefined') {
        window.location.hash = initial;
        sessionStorage.setItem(TAB_STORAGE_KEY, initial);
      }
    }
  });

  function handleSelectTab(tab: string) {
    activeTab = tab;
    mobileSidebarOpen = false;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(TAB_STORAGE_KEY, tab);
      window.location.hash = tab;
    }
  }

  onMount(() => {
    const handleHashChange = () => {
      if (!$authStore.currentUser) return;
      const hash = window.location.hash.replace('#', '').trim();
      const allowed = getAllowedTabs($authStore.currentUser.role);
      if (hash && allowed.includes(hash) && hash !== activeTab) {
        activeTab = hash;
        sessionStorage.setItem(TAB_STORAGE_KEY, hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  });
</script>

{#if !$authStore.isAuthenticated || !$authStore.currentUser}
  <Login />
{:else}
  <div class="app-shell">
    <!-- Sidebar Kiri (Desktop & Mobile) -->
    <div class={mobileSidebarOpen ? 'show' : ''}>
      <Sidebar
        user={$authStore.currentUser}
        {activeTab}
        onSelectTab={handleSelectTab}
      />
    </div>

    <!-- Area Konten Utama -->
    <div class="app-main">
      <!-- Topbar Header Responsif -->
      <div class="app-topbar d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
          <!-- Tombol Hamburger Mobile -->
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary d-md-none"
            aria-label="Buka menu navigasi"
            onclick={() => (mobileSidebarOpen = !mobileSidebarOpen)}
          >
            <i class="bi bi-list fs-5"></i>
          </button>
          <div class="fw-bold text-dark d-none d-md-block">
            Universitas Siber Muhammadiyah
          </div>
          <div class="fw-bold text-dark d-md-none">
            SIAKAD SiberMu
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <span class="badge badge-clean-primary text-capitalize px-2 py-1">
            {$authStore.currentUser.role}
          </span>
          <span class="small text-muted d-none d-sm-inline">
            {$authStore.currentUser.name}
          </span>
        </div>
      </div>

      <!-- Dashboard View Sesuai Role & Tab -->
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
