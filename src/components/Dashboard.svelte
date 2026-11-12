<script lang="ts">
  import type { User } from '../types/auth';
  import {
    courseStore,
    activityStore,
    addCourse,
    deleteCourse,
    toggleCourseStatus
  } from '../stores/dataStore';

  interface Props {
    user: User;
    activeTab: string;
  }

  let { user, activeTab }: Props = $props();

  let searchQuery = $state('');
  let filterStatus = $state('All');

  // Modal / Form Tambah Mata Kuliah
  let showAddModal = $state(false);
  let inputCode = $state('');
  let inputName = $state('');
  let inputSks = $state(3);
  let inputLecturer = $state('');
  let inputDay = $state('Senin');
  let inputTime = $state('08:00 - 10:30');
  let inputRoom = $state('LMS SiberMu (Online)');

  let courses = $derived($courseStore);
  let activities = $derived($activityStore);

  let filteredCourses = $derived(
    courses.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === 'All' || c.status === filterStatus;
      return matchSearch && matchStatus;
    })
  );

  let totalSks = $derived(courses.reduce((sum, c) => sum + c.sks, 0));
  let approvedSks = $derived(
    courses.filter((c) => c.status === 'Disetujui').reduce((sum, c) => sum + c.sks, 0)
  );

  let toastMessage = $state('');

  function triggerToast(msg: string) {
    toastMessage = msg;
    setTimeout(() => {
      toastMessage = '';
    }, 3000);
  }

  function handleSaveCourse(e: SubmitEvent) {
    e.preventDefault();
    if (!inputCode.trim() || !inputName.trim() || !inputLecturer.trim()) {
      alert('Mohon isi kode, nama mata kuliah, dan nama dosen.');
      return;
    }

    addCourse({
      code: inputCode.trim().toUpperCase(),
      name: inputName.trim(),
      sks: Number(inputSks),
      lecturer: inputLecturer.trim(),
      day: inputDay,
      time: inputTime.trim(),
      room: inputRoom.trim()
    });

    // Reset Form
    inputCode = '';
    inputName = '';
    inputSks = 3;
    inputLecturer = '';
    inputTime = '08:00 - 10:30';
    showAddModal = false;

    triggerToast('Mata kuliah berhasil ditambahkan ke Rencana Studi!');
  }

  function handleToggle(courseId: string, name: string) {
    toggleCourseStatus(courseId);
    triggerToast(`Status mata kuliah "${name}" diperbarui.`);
  }

  function handleDelete(courseId: string, name: string) {
    if (confirm(`Hapus mata kuliah "${name}" dari rencana studi?`)) {
      deleteCourse(courseId);
      triggerToast(`Mata kuliah "${name}" telah dihapus.`);
    }
  }
</script>

<div class="container-fluid">
  <!-- Toast Notifikasi -->
  {#if toastMessage}
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1055;">
      <div class="toast show bg-dark text-white border-0 shadow-lg" role="alert">
        <div class="d-flex align-items-center p-3">
          <i class="bi bi-info-circle-fill text-primary fs-5 me-2"></i>
          <div class="toast-body p-0 small">{toastMessage}</div>
          <button
            type="button"
            class="btn-close btn-close-white ms-auto"
            aria-label="Tutup notifikasi"
            onclick={() => (toastMessage = '')}
          ></button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Welcome Banner -->
  <div class="card border-0 rounded-4 shadow-sm mb-4 bg-white overflow-hidden">
    <div class="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <h4 class="fw-bold mb-0 text-dark">Selamat Datang, {user.name}!</h4>
          <span class="badge bg-primary-subtle text-primary border border-primary-subtle text-uppercase">
            {user.role}
          </span>
        </div>
        <p class="text-muted small mb-0">
          Sistem Informasi Akademik &bull; <strong>Universitas Siber Muhammadiyah</strong> ({user.department})
        </p>
      </div>
      <div>
        <button
          type="button"
          class="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
          onclick={() => (showAddModal = true)}
        >
          <i class="bi bi-plus-circle-fill"></i>
          <span>Tambah Mata Kuliah (KRS)</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Dynamic Metric Statistics Cards (Dihitung dari data real) -->
  <div class="row g-3 mb-4">
    <div class="col-sm-6 col-xl-3">
      <div class="card card-stat p-3 h-100 bg-white">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <div class="text-muted small fw-semibold text-uppercase">Mata Kuliah Terdaftar</div>
            <div class="fs-3 fw-bold text-dark mt-1">{courses.length} <span class="fs-6 text-muted">MK</span></div>
            <div class="small text-muted mt-1">
              Rencana studi semester ini
            </div>
          </div>
          <div class="icon-box bg-primary-subtle text-primary">
            <i class="bi bi-journal-text"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-6 col-xl-3">
      <div class="card card-stat p-3 h-100 bg-white">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <div class="text-muted small fw-semibold text-uppercase">Total Beban SKS</div>
            <div class="fs-3 fw-bold text-dark mt-1">{totalSks} <span class="fs-6 text-muted">SKS</span></div>
            <div class="small text-secondary mt-1">
              Batas maksimum: 24 SKS
            </div>
          </div>
          <div class="icon-box bg-info-subtle text-info">
            <i class="bi bi-mortarboard-fill"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-6 col-xl-3">
      <div class="card card-stat p-3 h-100 bg-white">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <div class="text-muted small fw-semibold text-uppercase">SKS Disetujui</div>
            <div class="fs-3 fw-bold text-success mt-1">{approvedSks} <span class="fs-6 text-muted">SKS</span></div>
            <div class="small text-success mt-1">
              <i class="bi bi-check-circle me-1"></i>Oleh Dosen Pembimbing
            </div>
          </div>
          <div class="icon-box bg-success-subtle text-success">
            <i class="bi bi-patch-check-fill"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-6 col-xl-3">
      <div class="card card-stat p-3 h-100 bg-white">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <div class="text-muted small fw-semibold text-uppercase">Status Mahasiswa</div>
            <div class="fs-3 fw-bold text-primary mt-1">TERDAFTAR</div>
            <div class="small text-muted mt-1">
              NIM: {user.identifierNumber}
            </div>
          </div>
          <div class="icon-box bg-warning-subtle text-warning">
            <i class="bi bi-person-badge-fill"></i>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Content Section -->
  <div class="row g-4">
    <!-- Main Table: Rencana Studi -->
    <div class="col-lg-8">
      <div class="card border-0 rounded-4 shadow-sm bg-white">
        <div class="card-header bg-white border-0 pt-4 px-4 pb-0">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 class="fw-bold mb-1">Rencana Studi Mahasiswa (KRS)</h5>
              <p class="text-muted small mb-0">Daftar mata kuliah yang diambil pada semester berjalan.</p>
            </div>

            <!-- Search & Filter Controls -->
            <div class="d-flex gap-2">
              <div class="input-group input-group-sm" style="width: 200px;">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  class="form-control border-start-0 ps-0"
                  placeholder="Cari matkul/dosen..."
                  bind:value={searchQuery}
                />
              </div>

              <select class="form-select form-select-sm" style="width: 130px;" bind:value={filterStatus}>
                <option value="All">Semua</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Menunggu">Menunggu</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card-body p-0 pt-3">
          <div class="table-responsive">
            <table class="table table-custom table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th class="ps-4">Kode & Mata Kuliah</th>
                  <th>SKS</th>
                  <th>Dosen Pengampu</th>
                  <th>Jadwal & Ruang/LMS</th>
                  <th>Status</th>
                  <th class="text-end pe-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {#if filteredCourses.length === 0}
                  <tr>
                    <td colspan="6" class="text-center py-5 text-muted">
                      <div class="py-4">
                        <i class="bi bi-inbox fs-1 text-secondary opacity-50 d-block mb-2"></i>
                        <h6 class="fw-bold text-secondary mb-1">Belum Ada Data Mata Kuliah</h6>
                        <p class="small text-muted mb-3">
                          {#if courses.length === 0}
                            Sistem tidak memiliki data dummy bawaan. Silakan tambahkan mata kuliah perdana Anda.
                          {:else}
                            Tidak ditemukan mata kuliah yang sesuai dengan kata kunci pencarian.
                          {/if}
                        </p>
                        {#if courses.length === 0}
                          <button
                            type="button"
                            class="btn btn-sm btn-primary px-3"
                            onclick={() => (showAddModal = true)}
                          >
                            <i class="bi bi-plus-circle me-1"></i> Input Mata Kuliah Sekarang
                          </button>
                        {/if}
                      </div>
                    </td>
                  </tr>
                {:else}
                  {#each filteredCourses as course (course.id)}
                    <tr>
                      <td class="ps-4">
                        <div class="fw-bold text-dark">{course.name}</div>
                        <span class="badge bg-light text-secondary border font-monospace" style="font-size: 0.7rem;">
                          {course.code}
                        </span>
                      </td>
                      <td>
                        <span class="badge bg-primary-subtle text-primary border border-primary-subtle">
                          {course.sks} SKS
                        </span>
                      </td>
                      <td class="small text-secondary">{course.lecturer}</td>
                      <td class="small">
                        <div class="fw-semibold text-dark">{course.day}, {course.time}</div>
                        <div class="text-muted small"><i class="bi bi-display me-1"></i>{course.room}</div>
                      </td>
                      <td>
                        {#if course.status === 'Disetujui'}
                          <span class="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2 py-1">
                            <i class="bi bi-check-circle-fill me-1"></i>Disetujui
                          </span>
                        {:else}
                          <span class="badge rounded-pill bg-warning-subtle text-warning border border-warning-subtle px-2 py-1">
                            <i class="bi bi-clock-fill me-1"></i>Menunggu
                          </span>
                        {/if}
                      </td>
                      <td class="text-end pe-4">
                        <div class="btn-group btn-group-sm">
                          <button
                            type="button"
                            class="btn {course.status === 'Disetujui' ? 'btn-outline-secondary' : 'btn-outline-success'}"
                            onclick={() => handleToggle(course.id, course.name)}
                            title="Ubah status persetujuan"
                          >
                            {course.status === 'Disetujui' ? 'Batalkan' : 'Setujui'}
                          </button>
                          <button
                            type="button"
                            class="btn btn-outline-danger"
                            onclick={() => handleDelete(course.id, course.name)}
                            title="Hapus mata kuliah"
                          >
                            <i class="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card-footer bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
          <small class="text-muted">Total: {filteredCourses.length} mata kuliah terdaftar</small>
          <small class="text-primary fw-semibold">{approvedSks} dari {totalSks} SKS telah disetujui</small>
        </div>
      </div>
    </div>

    <!-- Side Column: Riwayat Aktivitas & Info Kampus -->
    <div class="col-lg-4">
      <!-- Activity Feed -->
      <div class="card border-0 rounded-4 shadow-sm bg-white mb-4">
        <div class="card-header bg-white border-0 pt-4 px-4 pb-2">
          <h5 class="fw-bold mb-0">Catatan Aktivitas Sistem</h5>
          <small class="text-muted">Aktivitas real-time pada sesi ini</small>
        </div>
        <div class="card-body px-4 pt-2">
          {#if activities.length === 0}
            <div class="text-center py-4 text-muted small">
              <i class="bi bi-clock-history fs-3 text-secondary opacity-50 d-block mb-1"></i>
              Belum ada riwayat aktivitas tercatat.
            </div>
          {:else}
            <ul class="list-unstyled mb-0">
              {#each activities as act (act.id)}
                <li class="d-flex gap-3 mb-3 pb-3 border-bottom last:border-0">
                  <div class="mt-1">
                    {#if act.type === 'success'}
                      <i class="bi bi-check-circle-fill text-success fs-5"></i>
                    {:else if act.type === 'warning'}
                      <i class="bi bi-exclamation-circle-fill text-warning fs-5"></i>
                    {:else}
                      <i class="bi bi-info-circle-fill text-primary fs-5"></i>
                    {/if}
                  </div>
                  <div>
                    <div class="small fw-semibold text-dark">{act.action}</div>
                    <div class="text-muted" style="font-size: 0.75rem;">{act.timestamp}</div>
                  </div>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </div>

      <!-- Campus Identity Card -->
      <div class="card border-0 rounded-4 shadow-sm bg-white p-4">
        <div class="d-flex align-items-center gap-3 mb-3">
          <div class="icon-box bg-primary text-white">
            <i class="bi bi-building"></i>
          </div>
          <div>
            <h6 class="fw-bold mb-0">Universitas Siber Muhammadiyah</h6>
            <small class="text-muted">Kampus Siber Berbasis Teknologi</small>
          </div>
        </div>
        <p class="small text-muted mb-3">
          Penyelenggaraan pendidikan tinggi berbasis daring penuh dengan fleksibilitas tinggi dan kurikulum berstandar industri.
        </p>
        <div class="p-3 bg-light rounded-3 mb-2 small">
          <div class="fw-semibold text-dark">Layanan Akademik SiberMu</div>
          <div class="text-muted">Email: akademik@sibermu.ac.id</div>
          <div class="text-muted">Situs: www.sibermu.ac.id</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Modal Tambah Mata Kuliah Baru (Tanpa data dummy) -->
{#if showAddModal}
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(15, 23, 42, 0.6);" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg rounded-4">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title fw-bold">Tambah Mata Kuliah (KRS)</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Tutup modal"
            onclick={() => (showAddModal = false)}
          ></button>
        </div>
        <form onsubmit={handleSaveCourse}>
          <div class="modal-body">
            <div class="row g-2 mb-3">
              <div class="col-sm-4">
                <label for="inputCode" class="form-label small fw-semibold text-secondary">Kode MK</label>
                <input
                  id="inputCode"
                  type="text"
                  class="form-control"
                  placeholder="Misal: IF301"
                  bind:value={inputCode}
                  required
                />
              </div>
              <div class="col-sm-8">
                <label for="inputName" class="form-label small fw-semibold text-secondary">Nama Mata Kuliah</label>
                <input
                  id="inputName"
                  type="text"
                  class="form-control"
                  placeholder="Contoh: Pemrograman Web"
                  bind:value={inputName}
                  required
                />
              </div>
            </div>

            <div class="row g-2 mb-3">
              <div class="col-sm-4">
                <label for="inputSks" class="form-label small fw-semibold text-secondary">Bobot SKS</label>
                <select id="inputSks" class="form-select" bind:value={inputSks}>
                  <option value={1}>1 SKS</option>
                  <option value={2}>2 SKS</option>
                  <option value={3}>3 SKS</option>
                  <option value={4}>4 SKS</option>
                </select>
              </div>
              <div class="col-sm-8">
                <label for="inputLecturer" class="form-label small fw-semibold text-secondary">Dosen Pengampu</label>
                <input
                  id="inputLecturer"
                  type="text"
                  class="form-control"
                  placeholder="Nama dosen pengampu..."
                  bind:value={inputLecturer}
                  required
                />
              </div>
            </div>

            <div class="row g-2 mb-3">
              <div class="col-sm-4">
                <label for="inputDay" class="form-label small fw-semibold text-secondary">Hari</label>
                <select id="inputDay" class="form-select" bind:value={inputDay}>
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                </select>
              </div>
              <div class="col-sm-8">
                <label for="inputTime" class="form-label small fw-semibold text-secondary">Waktu / Jam Kuliah</label>
                <input
                  id="inputTime"
                  type="text"
                  class="form-control"
                  placeholder="Contoh: 09:00 - 11:30"
                  bind:value={inputTime}
                  required
                />
              </div>
            </div>

            <div class="mb-2">
              <label for="inputRoom" class="form-label small fw-semibold text-secondary">Ruang / Platform Online</label>
              <input
                id="inputRoom"
                type="text"
                class="form-control"
                placeholder="Misal: LMS SiberMu / Zoom Meeting"
                bind:value={inputRoom}
                required
              />
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button
              type="button"
              class="btn btn-light"
              onclick={() => (showAddModal = false)}
            >
              Batal
            </button>
            <button type="submit" class="btn btn-primary px-4">
              Simpan ke KRS
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
