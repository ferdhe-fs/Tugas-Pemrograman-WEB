<script lang="ts">
  import type { User } from '../types/auth';
  import {
    courseStore,
    SEMESTER_TRANSCRIPTS,
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
  let filterStatus = $state<'All' | 'Pending' | 'Approved'>('All');
  let isFilterOpen = $state(false);
  let showAddModal = $state(false);

  // Selected semester tab in transcript
  let selectedSemester = $state<number>(1);

  // New course form
  let inputCode = $state('');
  let inputName = $state('');
  let inputCredits = $state(3);
  let inputDay = $state('Monday');
  let inputTime = $state('08:00 - 10:30');

  let courses = $derived($courseStore);
  let totalCredits = $derived(courses.reduce((sum, c) => sum + c.credits, 0));
  let approvedCredits = $derived(
    courses.filter((c) => c.status === 'Approved').reduce((sum, c) => sum + c.credits, 0)
  );
  let pendingCourses = $derived(courses.filter((c) => c.status === 'Pending'));
  let approvedCourses = $derived(courses.filter((c) => c.status === 'Approved'));

  let filteredCourses = $derived(
    courses.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === 'All' || c.status === filterStatus;
      return matchSearch && matchStatus;
    })
  );

  function handleSaveCourse(e: SubmitEvent) {
    e.preventDefault();
    if (!inputCode.trim() || !inputName.trim()) return;

    addCourse({
      code: inputCode.trim().toUpperCase(),
      name: inputName.trim(),
      credits: Number(inputCredits),
      lecturer: 'DOSEN',
      day: inputDay,
      time: inputTime.trim(),
      room: 'SiberMu LMS (Online)',
      studentName: 'MAHASISWA',
      studentId: user.identifierNumber
    });

    inputCode = '';
    inputName = '';
    inputCredits = 3;
    showAddModal = false;
  }
</script>

<div class="p-3 p-md-4">
  <!-- ==================== STUDENT PORTAL ==================== -->
  {#if user.role === 'student'}
    {#if activeTab === 'overview'}
      <div class="mb-4">
        <h5 class="fw-bold text-dark mb-1">Academic Overview</h5>
        <p class="text-muted small mb-0">Welcome back, {user.name} ({user.identifierNumber})</p>
      </div>

      <!-- Stat Cards -->
      <div class="row g-3 mb-4">
        <div class="col-sm-4">
          <div class="card card-simple p-3 h-100">
            <div class="text-muted small">Total Credits (SKS)</div>
            <div class="fs-4 fw-bold text-dark mt-1">{totalCredits} Credits</div>
            <div class="small text-muted mt-1">Maximum allowed: 24 SKS</div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card card-simple p-3 h-100">
            <div class="text-muted small">Approved Credits</div>
            <div class="fs-4 fw-bold text-primary mt-1">{approvedCredits} Credits</div>
            <div class="small text-muted mt-1">{approvedCourses.length} courses approved</div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card card-simple p-3 h-100">
            <div class="text-muted small">Pending Approval</div>
            <div class="fs-4 fw-bold text-secondary mt-1">{pendingCourses.length} Courses</div>
            <div class="small text-muted mt-1">Under lecturer review</div>
          </div>
        </div>
      </div>

      <!-- Quick KRS View -->
      <div class="card card-simple overflow-hidden">
        <div class="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
          <h6 class="fw-bold mb-0">Current Study Plan (KRS)</h6>
          <button type="button" class="btn btn-primary btn-sm" onclick={() => onSelectTab('krs')}>
            Open Study Plan &rarr;
          </button>
        </div>
        <div class="table-responsive">
          <table class="table table-simple">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>Schedule</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {#each courses as c (c.id)}
                <tr>
                  <td class="font-monospace small text-muted">{c.code}</td>
                  <td class="fw-semibold text-dark">{c.name}</td>
                  <td>{c.credits} SKS</td>
                  <td class="small text-muted">{c.day}, {c.time}</td>
                  <td>
                    <span class="badge {c.status === 'Approved' ? 'badge-clean-primary' : 'badge-clean-neutral'} rounded-pill px-2 py-1">
                      {c.status}
                    </span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

    {:else if activeTab === 'krs'}
      <!-- Study Plan (KRS) -->
      <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <div>
          <h5 class="fw-bold text-dark mb-1">Study Plan (KRS)</h5>
          <p class="text-muted small mb-0">Manage enrolled courses for the current semester</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm px-3" onclick={() => (showAddModal = true)}>
          + Add Course
        </button>
      </div>

      <div class="card card-simple overflow-hidden">
        <!-- Search and Filter Bar -->
        <div class="p-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 bg-white">
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="Search courses..."
            style="max-width: 240px;"
            bind:value={searchQuery}
          />

          <!-- Clean Filter Dropdown -->
          <div class="filter-dropdown-container">
            <button
              type="button"
              class="filter-dropdown-btn"
              onclick={() => (isFilterOpen = !isFilterOpen)}
            >
              <span>{filterStatus}</span>
              <i class="bi bi-chevron-down small text-muted ms-1"></i>
            </button>

            {#if isFilterOpen}
              <button
                type="button"
                class="filter-dropdown-backdrop"
                aria-label="Close filter"
                tabindex="-1"
                onclick={() => (isFilterOpen = false)}
              ></button>

              <div class="filter-dropdown-menu">
                {#each ['All', 'Pending', 'Approved'] as st}
                  <button
                    type="button"
                    class="filter-item {filterStatus === st ? 'selected' : ''}"
                    onclick={() => { filterStatus = st as any; isFilterOpen = false; }}
                  >
                    <span>{st}</span>
                    {#if filterStatus === st}
                      <i class="bi bi-check2 text-primary ms-auto"></i>
                    {/if}
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-simple">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>Lecturer</th>
                <th>Schedule</th>
                <th>Status</th>
                <th class="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {#if filteredCourses.length === 0}
                <tr>
                  <td colspan="7" class="text-center py-5 text-muted small">No courses found matching criteria.</td>
                </tr>
              {:else}
                {#each filteredCourses as c (c.id)}
                  <tr>
                    <td class="font-monospace small text-muted">{c.code}</td>
                    <td class="fw-semibold text-dark">{c.name}</td>
                    <td>{c.credits} SKS</td>
                    <td class="small text-secondary">{c.lecturer}</td>
                    <td class="small text-muted">{c.day}, {c.time}</td>
                    <td>
                      <span class="badge {c.status === 'Approved' ? 'badge-clean-primary' : 'badge-clean-neutral'} rounded-pill px-2 py-1">
                        {c.status}
                      </span>
                    </td>
                    <td class="text-end">
                      <button
                        type="button"
                        class="btn btn-link btn-sm text-danger p-0 text-decoration-none"
                        onclick={() => { if (confirm(`Remove ${c.name}?`)) deleteCourse(c.id); }}
                      >
                        Delete
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
      <!-- Course Schedule -->
      <div class="mb-3">
        <h5 class="fw-bold text-dark mb-1">Weekly Course Schedule</h5>
        <p class="text-muted small mb-0">Synchronous and asynchronous lecture timings on SiberMu LMS</p>
      </div>

      <div class="card card-simple overflow-hidden">
        <div class="table-responsive">
          <table class="table table-simple">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Course Details</th>
                <th>Credits</th>
                <th>Lecturer</th>
                <th>Platform</th>
              </tr>
            </thead>
            <tbody>
              {#each courses as c (c.id)}
                <tr>
                  <td><span class="badge badge-clean-neutral">{c.day}</span></td>
                  <td class="small font-monospace">{c.time}</td>
                  <td class="fw-semibold text-dark">{c.name} <small class="text-muted">({c.code})</small></td>
                  <td>{c.credits} SKS</td>
                  <td class="small text-secondary">{c.lecturer}</td>
                  <td class="small text-muted">{c.room}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

    {:else if activeTab === 'transcript'}
      <!-- Academic Transcript Per Semester -->
      <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <div>
          <h5 class="fw-bold text-dark mb-1">Academic Transcript by Semester</h5>
          <p class="text-muted small mb-0">Semester evaluation cards and grade point averages (GPA)</p>
        </div>
        <div class="d-flex gap-2">
          {#each SEMESTER_TRANSCRIPTS as st}
            <button
              type="button"
              class="btn btn-sm {selectedSemester === st.semester ? 'btn-primary' : 'btn-outline-secondary'}"
              onclick={() => (selectedSemester = st.semester)}
            >
              Semester {st.semester}
            </button>
          {/each}
        </div>
      </div>

      {#each SEMESTER_TRANSCRIPTS.filter(s => s.semester === selectedSemester) as st (st.semester)}
        <!-- Summary Cards for Selected Semester -->
        <div class="row g-3 mb-3">
          <div class="col-sm-4">
            <div class="card card-simple p-3 text-center">
              <div class="text-muted small">Semester GPA</div>
              <div class="fs-3 fw-bold text-primary mt-1">{st.semesterGpa.toFixed(2)}</div>
              <div class="text-muted small">{st.academicYear}</div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="card card-simple p-3 text-center">
              <div class="text-muted small">Semester Credits</div>
              <div class="fs-3 fw-bold text-dark mt-1">{st.totalCredits} SKS</div>
              <div class="text-muted small">Passed Successfully</div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="card card-simple p-3 text-center">
              <div class="text-muted small">Cumulative GPA (IPK)</div>
              <div class="fs-3 fw-bold text-dark mt-1">3.84</div>
              <div class="text-muted small">Total 61 SKS Completed</div>
            </div>
          </div>
        </div>

        <!-- Transcript Table for Selected Semester -->
        <div class="card card-simple overflow-hidden">
          <div class="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
            <h6 class="fw-bold mb-0">Courses & Grades: Semester {st.semester}</h6>
            <span class="badge badge-clean-primary">{st.academicYear}</span>
          </div>

          <div class="table-responsive">
            <table class="table table-simple">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Credits (SKS)</th>
                  <th>Grade</th>
                  <th class="text-end">Grade Point</th>
                </tr>
              </thead>
              <tbody>
                {#each st.courses as crs, idx}
                  <tr>
                    <td class="text-muted small">{idx + 1}</td>
                    <td class="font-monospace small text-muted">{crs.code}</td>
                    <td class="fw-semibold text-dark">{crs.name}</td>
                    <td>{crs.credits}</td>
                    <td>
                      <span class="badge badge-clean-primary px-2 py-1">{crs.grade}</span>
                    </td>
                    <td class="text-end fw-semibold font-monospace">{crs.point.toFixed(2)}</td>
                  </tr>
                {/each}
              </tbody>
              <tfoot>
                <tr class="table-light fw-semibold">
                  <td colspan="3" class="text-end">Semester Summary:</td>
                  <td>{st.totalCredits} SKS</td>
                  <td colspan="2" class="text-end">Semester GPA: <span class="text-primary">{st.semesterGpa.toFixed(2)}</span></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      {/each}

    {:else if activeTab === 'profile'}
      <!-- Student Profile -->
      <div class="mb-3">
        <h5 class="fw-bold text-dark mb-1">Student Profile</h5>
        <p class="text-muted small mb-0">Official academic credentials and registration details</p>
      </div>

      <div class="card card-simple p-4">
        <div class="row g-3">
          <div class="col-sm-6">
            <label for="profStudentName" class="form-label small text-muted">Full Name</label>
            <input id="profStudentName" class="form-control form-control-sm" value={user.name} readonly />
          </div>
          <div class="col-sm-6">
            <label for="profStudentId" class="form-label small text-muted">Student ID Number (NIM)</label>
            <input id="profStudentId" class="form-control form-control-sm font-monospace" value={user.identifierNumber} readonly />
          </div>
          <div class="col-sm-6">
            <label for="profStudentDept" class="form-label small text-muted">Study Program</label>
            <input id="profStudentDept" class="form-control form-control-sm" value={user.department} readonly />
          </div>
          <div class="col-sm-6">
            <label for="profStudentEmail" class="form-label small text-muted">Email Address</label>
            <input id="profStudentEmail" class="form-control form-control-sm" value={user.email} readonly />
          </div>
          <div class="col-12">
            <label for="profStudentInst" class="form-label small text-muted">Institution</label>
            <input id="profStudentInst" class="form-control form-control-sm" value="Cyber Muhammadiyah University (Universitas Siber Muhammadiyah)" readonly />
          </div>
        </div>
      </div>
    {/if}

  <!-- ==================== LECTURER PORTAL ==================== -->
  {:else if user.role === 'lecturer'}
    {#if activeTab === 'overview'}
      <div class="mb-4">
        <h5 class="fw-bold text-dark mb-1">Teaching Overview</h5>
        <p class="text-muted small mb-0">Welcome, {user.name} ({user.identifierNumber})</p>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-sm-4">
          <div class="card card-simple p-3 h-100">
            <div class="text-muted small">Pending Approvals</div>
            <div class="fs-4 fw-bold text-primary mt-1">{pendingCourses.length} Requests</div>
            <div class="small text-muted mt-1">Awaiting your validation</div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card card-simple p-3 h-100">
            <div class="text-muted small">Approved Study Plans</div>
            <div class="fs-4 fw-bold text-dark mt-1">{approvedCourses.length} Approved</div>
            <div class="small text-muted mt-1">Verified enrollments</div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card card-simple p-3 h-100">
            <div class="text-muted small">Total Submissions</div>
            <div class="fs-4 fw-bold text-dark mt-1">{courses.length} Courses</div>
            <div class="small text-muted mt-1">From all students</div>
          </div>
        </div>
      </div>

      <div class="card card-simple p-4 text-center">
        <h6 class="fw-bold mb-1">Validate Student Study Plans</h6>
        <p class="text-muted small mb-3">Review course registrations submitted by advised students.</p>
        <button type="button" class="btn btn-primary btn-sm px-4" onclick={() => onSelectTab('approval')}>
          Go to KRS Approval &rarr;
        </button>
      </div>

    {:else if activeTab === 'approval'}
      <!-- KRS Approval (Lecturer) -->
      <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <div>
          <h5 class="fw-bold text-dark mb-1">KRS Approval & Validation</h5>
          <p class="text-muted small mb-0">Review student course plans and toggle approval status</p>
        </div>

        <!-- Filter Dropdown -->
        <div class="filter-dropdown-container">
          <button
            type="button"
            class="filter-dropdown-btn"
            onclick={() => (isFilterOpen = !isFilterOpen)}
          >
            <span>{filterStatus}</span>
            <i class="bi bi-chevron-down small text-muted ms-1"></i>
          </button>

          {#if isFilterOpen}
            <button
              type="button"
              class="filter-dropdown-backdrop"
              aria-label="Close filter"
              tabindex="-1"
              onclick={() => (isFilterOpen = false)}
            ></button>

            <div class="filter-dropdown-menu">
              {#each ['All', 'Pending', 'Approved'] as st}
                <button
                  type="button"
                  class="filter-item {filterStatus === st ? 'selected' : ''}"
                  onclick={() => { filterStatus = st as any; isFilterOpen = false; }}
                >
                  <span>{st}</span>
                  {#if filterStatus === st}
                    <i class="bi bi-check2 text-primary ms-auto"></i>
                  {/if}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <div class="card card-simple overflow-hidden">
        <div class="table-responsive">
          <table class="table table-simple">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Course Details</th>
                <th>Credits</th>
                <th>Schedule</th>
                <th>Status</th>
                <th class="text-end">Lecturer Action</th>
              </tr>
            </thead>
            <tbody>
              {#if filteredCourses.length === 0}
                <tr>
                  <td colspan="6" class="text-center py-5 text-muted small">No submissions in this category.</td>
                </tr>
              {:else}
                {#each filteredCourses as c (c.id)}
                  <tr>
                    <td>
                      <div class="fw-semibold text-dark">{c.studentName || 'MAHASISWA'}</div>
                      <small class="text-muted font-monospace">{c.studentId || '-'}</small>
                    </td>
                    <td>
                      <div class="fw-semibold text-dark">{c.name}</div>
                      <small class="text-muted font-monospace">{c.code}</small>
                    </td>
                    <td>{c.credits} SKS</td>
                    <td class="small text-muted">{c.day}, {c.time}</td>
                    <td>
                      <span class="badge {c.status === 'Approved' ? 'badge-clean-primary' : 'badge-clean-neutral'} rounded-pill px-2 py-1">
                        {c.status}
                      </span>
                    </td>
                    <td class="text-end">
                      {#if c.status === 'Pending'}
                        <button
                          type="button"
                          class="btn btn-sm btn-primary py-1 px-3"
                          onclick={() => setCourseStatus(c.id, 'Approved')}
                        >
                          Approve
                        </button>
                      {:else}
                        <button
                          type="button"
                          class="btn btn-sm btn-outline-secondary py-1 px-3"
                          onclick={() => setCourseStatus(c.id, 'Pending')}
                        >
                          Revoke
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
      <div class="mb-3">
        <h5 class="fw-bold text-dark mb-1">Assigned Courses</h5>
        <p class="text-muted small mb-0">Courses instructed during the current academic period</p>
      </div>

      <div class="card card-simple overflow-hidden">
        <div class="table-responsive">
          <table class="table table-simple">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>Platform</th>
                <th>Instruction Schedule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-monospace text-muted small">IF201</td>
                <td class="fw-semibold text-dark">Web Application Development</td>
                <td>3 SKS</td>
                <td class="small text-muted">SiberMu LMS</td>
                <td class="small text-dark">Monday, 08:00 - 10:30</td>
              </tr>
              <tr>
                <td class="font-monospace text-muted small">IF205</td>
                <td class="fw-semibold text-dark">Software Engineering</td>
                <td>3 SKS</td>
                <td class="small text-muted">SiberMu LMS</td>
                <td class="small text-dark">Wednesday, 13:30 - 16:00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    {:else if activeTab === 'schedule'}
      <div class="mb-3">
        <h5 class="fw-bold text-dark mb-1">Teaching & Consultation Schedule</h5>
        <p class="text-muted small mb-0">Synchronous sessions and academic advising hours</p>
      </div>

      <div class="card card-simple p-4">
        <div class="table-responsive">
          <table class="table table-simple">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Course / Activity</th>
                <th>Credits</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="badge badge-clean-neutral">Monday</span></td>
                <td class="small font-monospace">08:00 - 10:30 WIB</td>
                <td class="fw-semibold">Web Application Development</td>
                <td>3</td>
                <td class="small text-muted">Online Lecture (SiberMu LMS)</td>
              </tr>
              <tr>
                <td><span class="badge badge-clean-neutral">Wednesday</span></td>
                <td class="small font-monospace">13:30 - 15:30 WIB</td>
                <td class="fw-semibold">Academic Advising / KRS Consultation</td>
                <td>-</td>
                <td class="small text-muted">Student Guidance Hours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    {:else if activeTab === 'profile'}
      <div class="mb-3">
        <h5 class="fw-bold text-dark mb-1">Lecturer Profile</h5>
        <p class="text-muted small mb-0">Official faculty information and registration details</p>
      </div>

      <div class="card card-simple p-4">
        <div class="row g-3">
          <div class="col-sm-6">
            <label for="profLecName" class="form-label small text-muted">Lecturer Name</label>
            <input id="profLecName" class="form-control form-control-sm" value={user.name} readonly />
          </div>
          <div class="col-sm-6">
            <label for="profLecId" class="form-label small text-muted">Lecturer ID (NIDN)</label>
            <input id="profLecId" class="form-control form-control-sm font-monospace" value={user.identifierNumber} readonly />
          </div>
          <div class="col-sm-6">
            <label for="profLecDept" class="form-label small text-muted">Department</label>
            <input id="profLecDept" class="form-control form-control-sm" value={user.department} readonly />
          </div>
          <div class="col-sm-6">
            <label for="profLecEmail" class="form-label small text-muted">Campus Email</label>
            <input id="profLecEmail" class="form-control form-control-sm" value={user.email} readonly />
          </div>
          <div class="col-12">
            <label for="profLecFaculty" class="form-label small text-muted">Faculty / Institution</label>
            <input id="profLecFaculty" class="form-control form-control-sm" value="Faculty of Science & Technology - Cyber Muhammadiyah University" readonly />
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>

<!-- Modal Add Course -->
{#if showAddModal}
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(2px);" role="dialog">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 440px;">
      <div class="modal-content border-0 shadow rounded-3">
        <div class="modal-header border-bottom py-2 px-3">
          <h6 class="modal-title fw-bold">Enroll New Course (KRS)</h6>
          <button type="button" class="btn-close" aria-label="Close" onclick={() => (showAddModal = false)}></button>
        </div>
        <form onsubmit={handleSaveCourse}>
          <div class="modal-body p-3">
            <div class="row g-2 mb-2">
              <div class="col-4">
                <label for="inputCode" class="form-label small text-muted mb-1">Code</label>
                <input id="inputCode" type="text" class="form-control form-control-sm" placeholder="IF101" bind:value={inputCode} required />
              </div>
              <div class="col-8">
                <label for="inputName" class="form-label small text-muted mb-1">Course Title</label>
                <input id="inputName" type="text" class="form-control form-control-sm" placeholder="e.g. Cloud Computing" bind:value={inputName} required />
              </div>
            </div>

            <div class="row g-2 mb-2">
              <div class="col-4">
                <label for="inputCredits" class="form-label small text-muted mb-1">Credits</label>
                <select id="inputCredits" class="form-select form-select-sm" bind:value={inputCredits}>
                  <option value={1}>1 SKS</option>
                  <option value={2}>2 SKS</option>
                  <option value={3}>3 SKS</option>
                  <option value={4}>4 SKS</option>
                </select>
              </div>
              <div class="col-8">
                <label for="inputDay" class="form-label small text-muted mb-1">Day</label>
                <select id="inputDay" class="form-select form-select-sm" bind:value={inputDay}>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
            </div>

            <div class="mb-1">
              <label for="inputTime" class="form-label small text-muted mb-1">Class Time</label>
              <input id="inputTime" type="text" class="form-control form-control-sm" placeholder="e.g. 09:00 - 11:30" bind:value={inputTime} />
            </div>
          </div>
          <div class="modal-footer border-top py-2 px-3">
            <button type="button" class="btn btn-outline-secondary btn-sm" onclick={() => (showAddModal = false)}>Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm px-3">Save to Plan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
