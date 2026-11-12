<script lang="ts">
  import type { User } from '../types/auth';
  import {
    courseStore,
    addCourse,
    deleteCourse,
    setCourseStatus
  } from '../stores/dataStore';

  interface Props {
    user: User;
    activeTab: string;
    onSelectTab: (tab: string) => void;
  }

  let { user, activeTab, onSelectTab }: Props = $props();

  let searchQuery = $state('');
  let filterApproval = $state<'All' | 'Menunggu' | 'Disetujui'>('All');
  let isFilterDropdownOpen = $state(false);
  let showAddModal = $state(false);

  function getFilterLabel(val: 'All' | 'Menunggu' | 'Disetujui'): string {
    switch (val) {
      case 'Menunggu':
        return 'Status: Menunggu';
      case 'Disetujui':
        return 'Status: Disetujui';
      default:
        return 'Status: Semua';
    }
  }

  function handleSelectFilter(val: 'All' | 'Menunggu' | 'Disetujui') {
    filterApproval = val;
    isFilterDropdownOpen = false;
  }

  // Form input matkul mahasiswa
  let inputCode = $state('');
  let inputName = $state('');
  let inputSks = $state(3);
  let inputLecturer = $state('');
  let inputDay = $state('Senin');
  let inputTime = $state('08:00 - 10:30');

  let courses = $derived($courseStore);

  // Derived metrics
  let totalSks = $derived(courses.reduce((sum, c) => sum + c.sks, 0));
  let approvedSks = $derived(
    courses.filter((c) => c.status === 'Disetujui').reduce((sum, c) => sum + c.sks, 0)
  );
  let pendingCourses = $derived(courses.filter((c) => c.status === 'Menunggu'));
  let approvedCourses = $derived(courses.filter((c) => c.status === 'Disetujui'));

  let filteredCourses = $derived(
    courses.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterApproval === 'All' || c.status === filterApproval;
      return matchSearch && matchStatus;
    })
  );

  function handleSaveCourse(e: SubmitEvent) {
    e.preventDefault();
    if (!inputCode.trim() || !inputName.trim()) return;

    addCourse({
      code: inputCode.trim().toUpperCase(),
      name: inputName.trim(),
      sks: Number(inputSks),
      lecturer: inputLecturer.trim() || 'Dosen Pengampu',
      day: inputDay,
      time: inputTime.trim(),
      room: 'LMS SiberMu (Online)',
      studentName: user.name,
      studentId: user.identifierNumber
    });

    inputCode = '';
    inputName = '';
    inputSks = 3;
    inputLecturer = '';
    showAddModal = false;
  }
</script>

<div class="p-3 p-md-4">
  <!-- ==================== TAMPILAN MAHASISWA ==================== -->
  {#if user.role === 'mahasiswa'}
    {#if activeTab === 'overview'}
      <!-- Overview Mahasiswa -->
      <div class="mb-4">
        <h5 class="fw-bold text-dark mb-1">Ringkasan Studi Mahasiswa</h5>
        <p class="text-muted small mb-0">Selamat datang kembali, {user.name} ({user.identifierNumber})</p>
      </div>

      <!-- Stat Cards -->
      <div class="row g-3 mb-4">
        <div class="col-sm-4">
          <div class="card card-simple p-3 h-100">
            <div class="text-muted small">Total Beban SKS</div>
            <div class="fs-4 fw-bold text-dark mt-1">{totalSks} SKS</div>
            <div class="small text-muted mt-1">Batas maksimal: 24 SKS</div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card card-simple p-3 h-100">
            <div class="text-muted small">SKS Disetujui</div>
            <div class="fs-4 fw-bold text-primary mt-1">{approvedSks} SKS</div>
            <div class="small text-muted mt-1">{approvedCourses.length} mata kuliah disetujui</div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card card-simple p-3 h-100">
            <div class="text-muted small">Menunggu Validasi</div>
            <div class="fs-4 fw-bold text-secondary mt-1">{pendingCourses.length} MK</div>
            <div class="small text-muted mt-1">Oleh Dosen Pembimbing</div>
          </div>
        </div>
      </div>

      <!-- Quick Action / KRS Preview -->
      <div class="card card-simple overflow-hidden">
        <div class="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
          <h6 class="fw-bold mb-0">Rencana Studi Terkini</h6>
          <button type="button" class="btn btn-primary btn-sm" onclick={() => onSelectTab('krs')}>
            Buka Halaman KRS &rarr;
          </button>
        </div>
        <div class="p-0">
          {#if courses.length === 0}
            <div class="text-center py-5 text-muted small">
              Belum ada mata kuliah yang diambil.
              <div class="mt-2">
                <button type="button" class="btn btn-outline-primary btn-sm" onclick={() => { onSelectTab('krs'); showAddModal = true; }}>
                  + Ambil Mata Kuliah
                </button>
              </div>
            </div>
          {:else}
            <table class="table table-simple">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Mata Kuliah</th>
                  <th>SKS</th>
                  <th>Jadwal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {#each courses.slice(0, 3) as c}
                  <tr>
                    <td class="font-monospace small text-muted">{c.code}</td>
                    <td class="fw-semibold text-dark">{c.name}</td>
                    <td>{c.sks} SKS</td>
                    <td class="small text-muted">{c.day}, {c.time}</td>
                    <td>
                      <span class="badge {c.status === 'Disetujui' ? 'badge-clean-primary' : 'badge-clean-neutral'} rounded-pill px-2 py-1">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}
        </div>
      </div>

    {:else if activeTab === 'krs'}
      <!-- Halaman KRS Mahasiswa -->
      <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <div>
          <h5 class="fw-bold text-dark mb-1">Rencana Studi (KRS)</h5>
          <p class="text-muted small mb-0">Kelola mata kuliah yang Anda tempuh pada semester ini</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm px-3" onclick={() => (showAddModal = true)}>
          + Tambah Mata Kuliah
        </button>
      </div>

      <div class="card card-simple overflow-hidden">
        <div class="p-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 bg-white">
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="Cari mata kuliah atau dosen..."
            style="max-width: 250px;"
            bind:value={searchQuery}
          />
          <div class="d-flex align-items-center gap-2">
            <!-- Filter Dropdown Mahasiswa -->
            <div class="filter-dropdown-container">
              <button
                type="button"
                class="filter-dropdown-btn"
                onclick={() => (isFilterDropdownOpen = !isFilterDropdownOpen)}
              >
                <i class="bi bi-funnel text-muted"></i>
                <span>{getFilterLabel(filterApproval)}</span>
                <i class="bi bi-chevron-down small text-muted ms-1"></i>
              </button>

              {#if isFilterDropdownOpen}
                <button
                  type="button"
                  class="filter-dropdown-backdrop"
                  aria-label="Tutup menu filter"
                  tabindex="-1"
                  onclick={() => (isFilterDropdownOpen = false)}
                ></button>

                <div class="filter-dropdown-menu">
                  <button
                    type="button"
                    class="filter-item {filterApproval === 'All' ? 'selected' : ''}"
                    onclick={() => handleSelectFilter('All')}
                  >
                    <span>Semua Status</span>
                    <span class="badge badge-clean-neutral ms-auto">{courses.length}</span>
                    {#if filterApproval === 'All'}
                      <i class="bi bi-check2 text-primary ms-2"></i>
                    {/if}
                  </button>

                  <button
                    type="button"
                    class="filter-item {filterApproval === 'Menunggu' ? 'selected' : ''}"
                    onclick={() => handleSelectFilter('Menunggu')}
                  >
                    <span>Menunggu</span>
                    <span class="badge badge-clean-neutral ms-auto">{pendingCourses.length}</span>
                    {#if filterApproval === 'Menunggu'}
                      <i class="bi bi-check2 text-primary ms-2"></i>
                    {/if}
                  </button>

                  <button
                    type="button"
                    class="filter-item {filterApproval === 'Disetujui' ? 'selected' : ''}"
                    onclick={() => handleSelectFilter('Disetujui')}
                  >
                    <span>Disetujui</span>
                    <span class="badge badge-clean-neutral ms-auto">{approvedCourses.length}</span>
                    {#if filterApproval === 'Disetujui'}
                      <i class="bi bi-check2 text-primary ms-2"></i>
                    {/if}
                  </button>
                </div>
              {/if}
            </div>
            <small class="text-muted d-none d-sm-inline">({filteredCourses.length} MK)</small>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-simple">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Mata Kuliah</th>
                <th>SKS</th>
                <th>Dosen Pengampu</th>
                <th>Jadwal</th>
                <th>Status</th>
                <th class="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {#if filteredCourses.length === 0}
                <tr>
                  <td colspan="7" class="text-center py-5 text-muted">
                    <p class="mb-2">Tidak ada mata kuliah yang terdaftar.</p>
                    <button type="button" class="btn btn-outline-primary btn-sm" onclick={() => (showAddModal = true)}>
                      + Tambah Mata Kuliah Sekarang
                    </button>
                  </td>
                </tr>
              {:else}
                {#each filteredCourses as c (c.id)}
                  <tr>
                    <td class="font-monospace small text-muted">{c.code}</td>
                    <td class="fw-semibold text-dark">{c.name}</td>
                    <td>{c.sks} SKS</td>
                    <td class="small text-secondary">{c.lecturer}</td>
                    <td class="small text-muted">{c.day}, {c.time}</td>
                    <td>
                      <span class="badge {c.status === 'Disetujui' ? 'badge-clean-primary' : 'badge-clean-neutral'} rounded-pill px-2 py-1">
                        {c.status}
                      </span>
                    </td>
                    <td class="text-end">
                      <button
                        type="button"
                        class="btn btn-link btn-sm text-danger p-0 text-decoration-none"
                        onclick={() => { if (confirm(`Hapus mata kuliah ${c.name}?`)) deleteCourse(c.id); }}
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

    {:else if activeTab === 'schedule'}
      <!-- Jadwal Kuliah Mahasiswa -->
      <div class="mb-3">
        <h5 class="fw-bold text-dark mb-1">Jadwal Perkuliahan Mingguan</h5>
        <p class="text-muted small mb-0">Jadwal perkuliahan daring melalui LMS SiberMu</p>
      </div>

      <div class="card card-simple overflow-hidden">
        {#if courses.length === 0}
          <div class="text-center py-5 text-muted small">
            Belum ada jadwal karena Anda belum mengisi KRS.
            <div class="mt-2">
              <button type="button" class="btn btn-outline-primary btn-sm" onclick={() => onSelectTab('krs')}>
                Buka KRS
              </button>
            </div>
          </div>
        {:else}
          <div class="table-responsive">
            <table class="table table-simple">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Waktu</th>
                  <th>Kode & Mata Kuliah</th>
                  <th>SKS</th>
                  <th>Dosen Pengampu</th>
                  <th>Media</th>
                </tr>
              </thead>
              <tbody>
                {#each courses as c (c.id)}
                  <tr>
                    <td><span class="badge badge-clean-neutral">{c.day}</span></td>
                    <td class="small font-monospace">{c.time}</td>
                    <td class="fw-semibold text-dark">{c.name} <small class="text-muted">({c.code})</small></td>
                    <td>{c.sks} SKS</td>
                    <td class="small text-secondary">{c.lecturer}</td>
                    <td class="small text-muted">{c.room}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>

    {:else if activeTab === 'grades'}
      <!-- KHS Mahasiswa -->
      <div class="mb-3">
        <h5 class="fw-bold text-dark mb-1">Kartu Hasil Studi (KHS)</h5>
        <p class="text-muted small mb-0">Rekapitulasi perolehan SKS dan hasil evaluasi studi</p>
      </div>

      <div class="card card-simple p-4 mb-3">
        <div class="row g-3 text-center">
          <div class="col-sm-4 border-end">
            <div class="text-muted small">Total SKS Terambil</div>
            <div class="fs-3 fw-bold text-dark">{totalSks} SKS</div>
          </div>
          <div class="col-sm-4 border-end">
            <div class="text-muted small">SKS Disetujui</div>
            <div class="fs-3 fw-bold text-primary">{approvedSks} SKS</div>
          </div>
          <div class="col-sm-4">
            <div class="text-muted small">Status Registrasi</div>
            <div class="fs-3 fw-bold text-dark">AKTIF</div>
          </div>
        </div>
      </div>

    {:else if activeTab === 'profile'}
      <!-- Profil Mahasiswa -->
      <div class="mb-3">
        <h5 class="fw-bold text-dark mb-1">Biodata Mahasiswa</h5>
        <p class="text-muted small mb-0">Informasi data diri terdaftar di Universitas Siber Muhammadiyah</p>
      </div>

      <div class="card card-simple p-4">
        <div class="row g-3">
          <div class="col-sm-6">
            <label for="profName" class="form-label small text-muted">Nama Lengkap</label>
            <input id="profName" class="form-control form-control-sm" value={user.name} readonly />
          </div>
          <div class="col-sm-6">
            <label for="profNim" class="form-label small text-muted">Nomor Induk Mahasiswa (NIM)</label>
            <input id="profNim" class="form-control form-control-sm" value={user.identifierNumber} readonly />
          </div>
          <div class="col-sm-6">
            <label for="profProdi" class="form-label small text-muted">Program Studi</label>
            <input id="profProdi" class="form-control form-control-sm" value={user.department} readonly />
          </div>
          <div class="col-sm-6">
            <label for="profEmail" class="form-label small text-muted">Email Pengguna</label>
            <input id="profEmail" class="form-control form-control-sm" value={user.email} readonly />
          </div>
          <div class="col-12">
            <label for="profCampus" class="form-label small text-muted">Perguruan Tinggi</label>
            <input id="profCampus" class="form-control form-control-sm" value="Universitas Siber Muhammadiyah" readonly />
          </div>
        </div>
      </div>
    {/if}

  <!-- ==================== TAMPILAN DOSEN ==================== -->
  {:else if user.role === 'dosen'}
    {#if activeTab === 'overview'}
      <!-- Overview Dosen -->
      <div class="mb-4">
        <h5 class="fw-bold text-dark mb-1">Dosen Pengampu & Pembimbing</h5>
        <p class="text-muted small mb-0">Selamat datang, {user.name} ({user.identifierNumber})</p>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-sm-4">
          <div class="card card-simple p-3 h-100">
            <div class="text-muted small">Perlu Divalidasi</div>
            <div class="fs-4 fw-bold text-primary mt-1">{pendingCourses.length} Pengajuan</div>
            <div class="small text-muted mt-1">KRS menunggu persetujuan</div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card card-simple p-3 h-100">
            <div class="text-muted small">Sudah Disetujui</div>
            <div class="fs-4 fw-bold text-dark mt-1">{approvedCourses.length} Pengajuan</div>
            <div class="small text-muted mt-1">Rencana studi terverifikasi</div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card card-simple p-3 h-100">
            <div class="text-muted small">Total Pengajuan Masuk</div>
            <div class="fs-4 fw-bold text-dark mt-1">{courses.length} MK</div>
            <div class="small text-muted mt-1">Dari seluruh mahasiswa</div>
          </div>
        </div>
      </div>

      <div class="card card-simple p-4 text-center">
        <h6 class="fw-bold mb-1">Validasi KRS Mahasiswa Bimbingan</h6>
        <p class="text-muted small mb-3">Tinjau dan setujui rencana studi yang diajukan mahasiswa.</p>
        <div>
          <button type="button" class="btn btn-primary btn-sm px-4" onclick={() => onSelectTab('approval')}>
            Buka Menu Validasi KRS &rarr;
          </button>
        </div>
      </div>

    {:else if activeTab === 'approval'}
      <!-- Validasi KRS Dosen -->
      <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <div>
          <h5 class="fw-bold text-dark mb-1">Validasi & Persetujuan KRS</h5>
          <p class="text-muted small mb-0">Tinjau rencana studi mahasiswa dan ubah status persetujuan</p>
        </div>

        <!-- Filter Dropdown (Hover & Low-Contrast Selected) -->
        <div class="filter-dropdown-container">
          <button
            type="button"
            class="filter-dropdown-btn"
            onclick={() => (isFilterDropdownOpen = !isFilterDropdownOpen)}
          >
            <i class="bi bi-funnel text-muted"></i>
            <span>{getFilterLabel(filterApproval)}</span>
            <i class="bi bi-chevron-down small text-muted ms-1"></i>
          </button>

          {#if isFilterDropdownOpen}
            <button
              type="button"
              class="filter-dropdown-backdrop"
              aria-label="Tutup menu filter"
              tabindex="-1"
              onclick={() => (isFilterDropdownOpen = false)}
            ></button>

            <div class="filter-dropdown-menu">
              <button
                type="button"
                class="filter-item {filterApproval === 'All' ? 'selected' : ''}"
                onclick={() => handleSelectFilter('All')}
              >
                <span>Semua Status</span>
                <span class="badge badge-clean-neutral ms-auto">{courses.length}</span>
                {#if filterApproval === 'All'}
                  <i class="bi bi-check2 text-primary ms-2"></i>
                {/if}
              </button>

              <button
                type="button"
                class="filter-item {filterApproval === 'Menunggu' ? 'selected' : ''}"
                onclick={() => handleSelectFilter('Menunggu')}
              >
                <span>Menunggu</span>
                <span class="badge badge-clean-neutral ms-auto">{pendingCourses.length}</span>
                {#if filterApproval === 'Menunggu'}
                  <i class="bi bi-check2 text-primary ms-2"></i>
                {/if}
              </button>

              <button
                type="button"
                class="filter-item {filterApproval === 'Disetujui' ? 'selected' : ''}"
                onclick={() => handleSelectFilter('Disetujui')}
              >
                <span>Disetujui</span>
                <span class="badge badge-clean-neutral ms-auto">{approvedCourses.length}</span>
                {#if filterApproval === 'Disetujui'}
                  <i class="bi bi-check2 text-primary ms-2"></i>
                {/if}
              </button>
            </div>
          {/if}
        </div>
      </div>

      <div class="card card-simple overflow-hidden">
        <div class="table-responsive">
          <table class="table table-simple">
            <thead>
              <tr>
                <th>Mahasiswa (Pemohon)</th>
                <th>Kode & Mata Kuliah</th>
                <th>SKS</th>
                <th>Jadwal</th>
                <th>Status Saat Ini</th>
                <th class="text-end">Aksi Dosen</th>
              </tr>
            </thead>
            <tbody>
              {#if filteredCourses.length === 0}
                <tr>
                  <td colspan="6" class="text-center py-5 text-muted small">
                    Tidak ada pengajuan KRS pada kategori ini.
                  </td>
                </tr>
              {:else}
                {#each filteredCourses as c (c.id)}
                  <tr>
                    <td>
                      <div class="fw-semibold text-dark">{c.studentName || 'Mahasiswa'}</div>
                      <small class="text-muted font-monospace">{c.studentId || '-'}</small>
                    </td>
                    <td>
                      <div class="fw-semibold text-dark">{c.name}</div>
                      <small class="text-muted font-monospace">{c.code}</small>
                    </td>
                    <td>{c.sks} SKS</td>
                    <td class="small text-muted">{c.day}, {c.time}</td>
                    <td>
                      <span class="badge {c.status === 'Disetujui' ? 'badge-clean-primary' : 'badge-clean-neutral'} rounded-pill px-2 py-1">
                        {c.status}
                      </span>
                    </td>
                    <td class="text-end">
                      {#if c.status === 'Menunggu'}
                        <button
                          type="button"
                          class="btn btn-sm btn-primary py-1 px-3"
                          onclick={() => setCourseStatus(c.id, 'Disetujui')}
                        >
                          Setujui
                        </button>
                      {:else}
                        <button
                          type="button"
                          class="btn btn-sm btn-outline-secondary py-1 px-3"
                          onclick={() => setCourseStatus(c.id, 'Menunggu')}
                        >
                          Batalkan
                        </button>
                      {/if}
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>

    {:else if activeTab === 'courses'}
      <!-- Mata Kuliah Diampu Dosen -->
      <div class="mb-3">
        <h5 class="fw-bold text-dark mb-1">Mata Kuliah Diampu</h5>
        <p class="text-muted small mb-0">Daftar mata kuliah yang Anda bimbing pada semester ini</p>
      </div>

      <div class="card card-simple overflow-hidden">
        <div class="table-responsive">
          <table class="table table-simple">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Mata Kuliah</th>
                <th>SKS</th>
                <th>Platform / Ruang</th>
                <th>Jadwal Bimbingan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-monospace text-muted small">IF201</td>
                <td class="fw-semibold text-dark">Pemrograman Berbasis Web</td>
                <td>3 SKS</td>
                <td class="small text-muted">LMS SiberMu</td>
                <td class="small text-dark">Senin, 08:00 - 10:30</td>
              </tr>
              <tr>
                <td class="font-monospace text-muted small">IF204</td>
                <td class="fw-semibold text-dark">Rekayasa Perangkat Lunak</td>
                <td>3 SKS</td>
                <td class="small text-muted">LMS SiberMu</td>
                <td class="small text-dark">Selasa, 10:45 - 13:15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    {:else if activeTab === 'schedule'}
      <!-- Jadwal Mengajar Dosen -->
      <div class="mb-3">
        <h5 class="fw-bold text-dark mb-1">Jadwal Mengajar & Konsultasi</h5>
        <p class="text-muted small mb-0">Jadwal perkuliahan sinkronus & asinkronus</p>
      </div>

      <div class="card card-simple p-4">
        <div class="table-responsive">
          <table class="table table-simple">
            <thead>
              <tr>
                <th>Hari</th>
                <th>Waktu</th>
                <th>Mata Kuliah</th>
                <th>SKS</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="badge badge-clean-neutral">Senin</span></td>
                <td class="small font-monospace">08:00 - 10:30 WIB</td>
                <td class="fw-semibold">Pemrograman Berbasis Web</td>
                <td>3</td>
                <td class="small text-muted">Kuliah Daring LMS SiberMu</td>
              </tr>
              <tr>
                <td><span class="badge badge-clean-neutral">Rabu</span></td>
                <td class="small font-monospace">13:30 - 15:30 WIB</td>
                <td class="fw-semibold">Bimbingan Akademik / KRS</td>
                <td>-</td>
                <td class="small text-muted">Konsultasi Mahasiswa Bimbingan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    {:else if activeTab === 'profile'}
      <!-- Profil Dosen -->
      <div class="mb-3">
        <h5 class="fw-bold text-dark mb-1">Profil & NIDN Dosen</h5>
        <p class="text-muted small mb-0">Informasi kepegawaian dan akademik dosen</p>
      </div>

      <div class="card card-simple p-4">
        <div class="row g-3">
          <div class="col-sm-6">
            <label for="profDosenName" class="form-label small text-muted">Nama Dosen & Gelar</label>
            <input id="profDosenName" class="form-control form-control-sm" value={user.name} readonly />
          </div>
          <div class="col-sm-6">
            <label for="profNidn" class="form-label small text-muted">NIDN / NIP</label>
            <input id="profNidn" class="form-control form-control-sm" value={user.identifierNumber} readonly />
          </div>
          <div class="col-sm-6">
            <label for="profDosenProdi" class="form-label small text-muted">Program Studi Pengampu</label>
            <input id="profDosenProdi" class="form-control form-control-sm" value={user.department} readonly />
          </div>
          <div class="col-sm-6">
            <label for="profDosenEmail" class="form-label small text-muted">Email Resmi Kampus</label>
            <input id="profDosenEmail" class="form-control form-control-sm" value={user.email} readonly />
          </div>
          <div class="col-12">
            <label for="profDosenUniv" class="form-label small text-muted">Unit Kerja</label>
            <input id="profDosenUniv" class="form-control form-control-sm" value="Fakultas Sains dan Teknologi - Universitas Siber Muhammadiyah" readonly />
          </div>
        </div>
      </div>
    {/if}

  <!-- ==================== TAMPILAN ADMIN ==================== -->
  {:else}
    <div class="mb-3">
      <h5 class="fw-bold text-dark mb-1">Panel Biro Administrasi Akademik (BAA)</h5>
      <p class="text-muted small mb-0">Kelola dan pantau seluruh rencana studi yang terdaftar</p>
    </div>

    <div class="card card-simple overflow-hidden">
      <div class="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
        <h6 class="fw-bold mb-0">Seluruh Mata Kuliah Terdaftar di Sistem ({courses.length})</h6>
        <span class="badge badge-clean-primary">BAA SiberMu</span>
      </div>
      <div class="table-responsive">
        <table class="table table-simple">
          <thead>
            <tr>
              <th>Pemohon</th>
              <th>Kode & Mata Kuliah</th>
              <th>SKS</th>
              <th>Dosen</th>
              <th>Status</th>
              <th class="text-end">Aksi Admin</th>
            </tr>
          </thead>
          <tbody>
            {#if courses.length === 0}
              <tr>
                <td colspan="6" class="text-center py-4 text-muted small">Belum ada data mata kuliah.</td>
              </tr>
            {:else}
              {#each courses as c (c.id)}
                <tr>
                  <td>
                    <div class="fw-semibold">{c.studentName || 'Mahasiswa'}</div>
                    <small class="text-muted font-monospace">{c.studentId || '-'}</small>
                  </td>
                  <td>
                    <div class="fw-semibold">{c.name}</div>
                    <small class="text-muted font-monospace">{c.code}</small>
                  </td>
                  <td>{c.sks} SKS</td>
                  <td class="small text-muted">{c.lecturer}</td>
                  <td>
                    <span class="badge {c.status === 'Disetujui' ? 'badge-clean-primary' : 'badge-clean-neutral'} rounded-pill px-2 py-1">
                      {c.status}
                    </span>
                  </td>
                  <td class="text-end">
                    <button
                      type="button"
                      class="btn btn-link btn-sm text-danger text-decoration-none p-0"
                      onclick={() => deleteCourse(c.id)}
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
  {/if}
</div>

<!-- Modal Tambah Mata Kuliah Mahasiswa -->
{#if showAddModal}
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(15, 23, 42, 0.4);" role="dialog">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 440px;">
      <div class="modal-content border-0 shadow rounded-3">
        <div class="modal-header border-bottom py-2 px-3">
          <h6 class="modal-title fw-bold">Tambah Mata Kuliah (KRS)</h6>
          <button type="button" class="btn-close" aria-label="Tutup" onclick={() => (showAddModal = false)}></button>
        </div>
        <form onsubmit={handleSaveCourse}>
          <div class="modal-body p-3">
            <div class="row g-2 mb-2">
              <div class="col-4">
                <label for="inputCode" class="form-label small text-muted mb-1">Kode MK</label>
                <input id="inputCode" type="text" class="form-control form-control-sm" placeholder="IF101" bind:value={inputCode} required />
              </div>
              <div class="col-8">
                <label for="inputName" class="form-label small text-muted mb-1">Nama Mata Kuliah</label>
                <input id="inputName" type="text" class="form-control form-control-sm" placeholder="Nama mata kuliah" bind:value={inputName} required />
              </div>
            </div>

            <div class="row g-2 mb-2">
              <div class="col-4">
                <label for="inputSks" class="form-label small text-muted mb-1">Bobot SKS</label>
                <select id="inputSks" class="form-select form-select-sm" bind:value={inputSks}>
                  <option value={1}>1 SKS</option>
                  <option value={2}>2 SKS</option>
                  <option value={3}>3 SKS</option>
                  <option value={4}>4 SKS</option>
                </select>
              </div>
              <div class="col-8">
                <label for="inputLecturer" class="form-label small text-muted mb-1">Dosen Pengampu</label>
                <input id="inputLecturer" type="text" class="form-control form-control-sm" placeholder="Nama dosen pengampu" bind:value={inputLecturer} />
              </div>
            </div>

            <div class="row g-2 mb-2">
              <div class="col-4">
                <label for="inputDay" class="form-label small text-muted mb-1">Hari</label>
                <select id="inputDay" class="form-select form-select-sm" bind:value={inputDay}>
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                </select>
              </div>
              <div class="col-8">
                <label for="inputTime" class="form-label small text-muted mb-1">Waktu</label>
                <input id="inputTime" type="text" class="form-control form-control-sm" placeholder="Contoh: 08:00 - 10:30" bind:value={inputTime} />
              </div>
            </div>
          </div>
          <div class="modal-footer border-top py-2 px-3">
            <button type="button" class="btn btn-outline-secondary btn-sm" onclick={() => (showAddModal = false)}>Batal</button>
            <button type="submit" class="btn btn-primary btn-sm px-3">Simpan ke KRS</button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
