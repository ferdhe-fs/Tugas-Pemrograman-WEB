<script lang="ts">
  import { authStore } from './stores/authStore';
  import Login from './components/Login.svelte';
  import Navbar from './components/Navbar.svelte';
  import Dashboard from './components/Dashboard.svelte';
</script>

{#if !$authStore.isAuthenticated || !$authStore.currentUser}
  <Login />
{:else}
  <div class="min-vh-100 d-flex flex-column" style="background-color: var(--app-bg);">
    <Navbar user={$authStore.currentUser} />
    <main class="flex-grow-1">
      <Dashboard user={$authStore.currentUser} />
    </main>
  </div>
{/if}
