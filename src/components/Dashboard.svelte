<script lang="ts">
  import type { User } from '../types/auth';
  import {
    courseStore,
    addCourse,
    deleteCourse,
    toggleCourseStatus
  } from '../stores/dataStore';

  interface Props {
    user: User;
  }

  let { user }: Props = $props();

  let searchQuery = $state('');
  let showModal = $state(false);

  // Form input
  let inputCode = $state('');
  let inputName = $state('');
  let inputSks = $state(3);
  let inputLecturer = $state('');
  let inputSchedule = $state('');

  let courses = $derived($courseStore);
  let filteredCourses = $derived(
    courses.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lecturer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  let totalSks = $derived(courses.reduce((sum, c) => sum + c.sks, 0));
  let approvedSks = $derived(
    courses.filter((c) => c.status === 'Disetujui').reduce((sum, c) => sum + c.sks, 0)
  );

  function handleSave(e: SubmitEvent) {
    e.preventDefault();
    if (!inputCode.trim() || !inputName.trim()) return;

    addCourse({
      code: inputCode.trim().toUpperCase(),
      name: inputName.trim(),
      sks: Number(inputSks),
      lecturer: inputLecturer.trim() || '-',
      day: '-',
      time: inputSchedule.trim() || 'Online',
      room: 'LMS SiberMu'
    });

    inputCode = '';
    inputName = '';
    inputSks = 3;
    inputLecturer = '';
    inputSchedule = '';
    showModal = false;
  }
</script>

<div class="container py-4">
  <!-- Ringkasan Profil Pengguna -->
  <div class="card card-simple p-3 mb-3">
    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
      <div>
        <div class="fw-semibold text-dark">{user.name}</div>
        <div class="text-muted small">
          NIM: <span class="text-dark">{user.identifierNumber}</span> &bull;
          Prodi: <span class="text-dark">{user.department}</span>
        </div>
      </div>
      <div class="d-flex gap-3 text-sm-end">
        <div>
          <div class="text-muted small">Total SKS</div>
          <div class="fw-bold text-dark">{totalSks} SKS</div>
        </div>
        <div class="border-start ps-3">
          <div class="text-muted small">Disetujui</div>
          <div class="fw-bold text-primary">{approvedSks} SKS</div>
        </div>
        <div class="border-start ps-3">
          <div class="text-muted small">Mata Kuliah</div>
          <div class="fw-bold text-dark">{courses.length}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Konten Utama: Daftar KRS -->
  <div class="card card-simple overflow-hidden">
    <!-- Header Tabel & Aksi -->
    <div class="p-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 bg-white">
      <div>
        <h6 class="fw-bold mb-0 text-dark">Rencana Studi (KRS)</h6>
        <small class="text-muted">Daftar mata kuliah yang diambil semester ini</small>
      </div>
      <div class="d-flex gap-2">
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Cari mata kuliah..."
          style="max-width: 200px;"
          bind:value={searchQuery}
        />
        <button
          type="button"
          class="btn btn-primary btn-sm px-3 text-nowrap"
          onclick={() => (showModal = true)}
        >
          + Tambah Matkul
        </button>
      </div>
    </div>

    <!-- Tabel KRS -->
    <div class="table-responsive">
      <table class="table table-simple">
        <thead>
          <tr>
            <th>Kode</th>
            <th>Mata Kuliah</th>
            <th>SKS</th>
            <th>Dosen / Jadwal</th>
            <th>Status</th>
            <th class="text-end">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#if filteredCourses.length === 0}
            <tr>
              <td colspan="6" class="text-center py-5 text-muted">
                <div class="py-2">
                  <p class="mb-2">Belum ada mata kuliah yang diambil.</p>
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm"
                    onclick={() => (showModal = true)}
                  >
                    + Tambah Mata Kuliah Pertama
                  </button>
                </div>
              </td>
            </tr>
          {:else}
            {#each filteredCourses as c (c.id)}
              <tr>
                <td class="fw-semibold text-secondary font-monospace small">{c.code}</td>
                <td class="fw-semibold text-dark">{c.name}</td>
                <td>{c.sks} SKS</td>
                <td class="text-muted small">
                  <div>{c.lecturer}</div>
                  <div class="text-secondary">{c.time}</div>
                </td>
                <td>
                  {#if c.status === 'Disetujui'}
                    <span class="badge badge-clean-primary rounded-pill px-2 py-1">Disetujui</span>
                  {:else}
                    <span class="badge badge-clean-neutral rounded-pill px-2 py-1">Menunggu</span>
                  {/if}
                </td>
                <td class="text-end">
                  <button
                    type="button"
                    class="btn btn-link btn-sm text-decoration-none text-secondary p-0 me-2"
                    onclick={() => toggleCourseStatus(c.id)}
                  >
                    {c.status === 'Disetujui' ? 'Batal' : 'Setujui'}
                  </button>
                  <button
                    type="button"
                    class="btn btn-link btn-sm text-decoration-none text-danger p-0"
                    onclick={() => { if (confirm(`Hapus ${c.name}?`)) deleteCourse(c.id); }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- Modal Ringkas Tambah Mata Kuliah -->
{#if showModal}
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(15, 23, 42, 0.4);" role="dialog">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 440px;">
      <div class="modal-content border-0 shadow rounded-3">
        <div class="modal-header border-bottom py-2 px-3">
          <h6 class="modal-title fw-bold">Tambah Mata Kuliah</h6>
          <button type="button" class="btn-close" aria-label="Tutup" onclick={() => (showModal = false)}></button>
        </div>
        <form onsubmit={handleSave}>
          <div class="modal-body p-3">
            <div class="row g-2 mb-2">
              <div class="col-4">
                <label for="code" class="form-label small text-muted mb-1">Kode</label>
                <input id="code" type="text" class="form-control form-control-sm" placeholder="IF101" bind:value={inputCode} required />
              </div>
              <div class="col-8">
                <label for="name" class="form-label small text-muted mb-1">Nama Mata Kuliah</label>
                <input id="name" type="text" class="form-control form-control-sm" placeholder="Nama matkul" bind:value={inputName} required />
              </div>
            </div>

            <div class="row g-2 mb-2">
              <div class="col-4">
                <label for="sks" class="form-label small text-muted mb-1">Bobot SKS</label>
                <select id="sks" class="form-select form-select-sm" bind:value={inputSks}>
                  <option value={1}>1 SKS</option>
                  <option value={2}>2 SKS</option>
                  <option value={3}>3 SKS</option>
                  <option value={4}>4 SKS</option>
                </select>
              </div>
              <div class="col-8">
                <label for="lecturer" class="form-label small text-muted mb-1">Dosen Pengampu</label>
                <input id="lecturer" type="text" class="form-control form-control-sm" placeholder="Nama dosen" bind:value={inputLecturer} />
              </div>
            </div>

            <div class="mb-1">
              <label for="schedule" class="form-label small text-muted mb-1">Jadwal Kuliah</label>
              <input id="schedule" type="text" class="form-control form-control-sm" placeholder="Contoh: Senin, 09:00 WIB" bind:value={inputSchedule} />
            </div>
          </div>
          <div class="modal-footer border-top py-2 px-3">
            <button type="button" class="btn btn-outline-secondary btn-sm" onclick={() => (showModal = false)}>Batal</button>
            <button type="submit" class="btn btn-primary btn-sm px-3">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
