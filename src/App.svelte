<script lang="ts">
  import { authStore } from './stores/authStore';
  import Login from './components/Login.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import Dashboard from './components/Dashboard.svelte';

  let activeTab = $state('overview');
  let mobileSidebarOpen = $state(false);

  function handleSelectTab(tab: string) {
    activeTab = tab;
    mobileSidebarOpen = false;
  }
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
