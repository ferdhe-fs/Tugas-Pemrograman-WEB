<script lang="ts">
  import { authStore } from './stores/authStore';
  import { courseStore } from './stores/dataStore';
  import Login from './components/Login.svelte';
  import Navbar from './components/Navbar.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import Dashboard from './components/Dashboard.svelte';

  let activeTab = $state('overview');

  function handleSelectTab(tab: string) {
    activeTab = tab;
  }

  let courses = $derived($courseStore);
</script>

{#if !$authStore.isAuthenticated || !$authStore.currentUser}
  <Login />
{:else}
  <div class="dashboard-wrapper">
    <!-- Top Navigation Bar -->
    <Navbar user={$authStore.currentUser} />

    <!-- Main Content Area with Sidebar -->
    <div class="main-layout">
      <Sidebar
        user={$authStore.currentUser}
        {activeTab}
        onSelectTab={handleSelectTab}
      />

      <main class="content-area">
        {#if activeTab === 'overview' || activeTab === 'krs'}
          <Dashboard user={$authStore.currentUser} {activeTab} />
        {:else if activeTab === 'schedule'}
          <div class="card border-0 rounded-4 shadow-sm bg-white p-4">
            <h4 class="fw-bold mb-3"><i class="bi bi-calendar-week text-primary me-2"></i>Jadwal Perkuliahan</h4>
            <p class="text-muted small">Jadwal sinkronus & asinkronus yang diambil pada semester ini di Universitas Siber Muhammadiyah.</p>

            {#if courses.length === 0}
              <div class="alert alert-warning d-flex align-items-center gap-2">
                <i class="bi bi-exclamation-triangle-fill fs-5"></i>
                <span>Belum ada jadwal perkuliahan karena Anda belum menambahkan mata kuliah di menu Rencana Studi (KRS).</span>
              </div>
            {:else}
              <div class="table-responsive mt-2">
                <table class="table table-bordered align-middle">
                  <thead class="table-light">
                    <tr>
                      <th>Hari</th>
                      <th>Waktu</th>
                      <th>Kode & Mata Kuliah</th>
                      <th>SKS</th>
                      <th>Platform / Ruang</th>
                      <th>Dosen Pengampu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each courses as c (c.id)}
                      <tr>
                        <td><span class="badge bg-primary">{c.day}</span></td>
                        <td>{c.time}</td>
                        <td class="fw-bold">{c.name} <small class="text-muted font-monospace">({c.code})</small></td>
                        <td>{c.sks} SKS</td>
                        <td><i class="bi bi-display me-1 text-secondary"></i>{c.room}</td>
                        <td class="small">{c.lecturer}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/if}
          </div>
        {:else if activeTab === 'profile'}
          <div class="card border-0 rounded-4 shadow-sm bg-white p-4">
            <h4 class="fw-bold mb-3"><i class="bi bi-person-circle text-primary me-2"></i>Biodata Pengguna</h4>
            <div class="row g-4 align-items-center">
              <div class="col-md-3 text-center">
                <img
                  src={$authStore.currentUser.avatarUrl}
                  alt={$authStore.currentUser.name}
                  class="rounded-circle border border-3 border-primary shadow-sm mb-2"
                  width="110"
                  height="110"
                />
                <div class="fw-bold">{$authStore.currentUser.name}</div>
                <div class="badge bg-primary text-uppercase mt-1">{$authStore.currentUser.role}</div>
              </div>
              <div class="col-md-9">
                <div class="row g-3">
                  <div class="col-sm-6">
                    <label for="profileIdNumber" class="form-label small text-muted">Nomor Induk (NIM / NIDN)</label>
                    <input id="profileIdNumber" class="form-control" value={$authStore.currentUser.identifierNumber} readonly />
                  </div>
                  <div class="col-sm-6">
                    <label for="profileEmail" class="form-label small text-muted">Email Pengguna</label>
                    <input id="profileEmail" class="form-control" value={$authStore.currentUser.email} readonly />
                  </div>
                  <div class="col-sm-6">
                    <label for="profileDept" class="form-label small text-muted">Program Studi / Unit</label>
                    <input id="profileDept" class="form-control" value={$authStore.currentUser.department} readonly />
                  </div>
                  <div class="col-sm-6">
                    <label for="profileInst" class="form-label small text-muted">Perguruan Tinggi</label>
                    <input id="profileInst" class="form-control" value="Universitas Siber Muhammadiyah" readonly />
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </main>
    </div>
  </div>
{/if}
