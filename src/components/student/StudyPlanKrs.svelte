<script lang="ts">
  import type { User } from '../../types/auth';
  import { courseStore, addCourse, deleteCourse } from '../../stores/dataStore';
  import StatusDropdown from '../common/StatusDropdown.svelte';

  interface Props {
    user: User;
  }

  let { user }: Props = $props();

  let searchQuery = $state('');
  let filterStatus = $state<'All' | 'Pending' | 'Approved'>('All');
  let showModal = $state(false);

  // Form states
  let code = $state('');
  let name = $state('');
  let credits = $state(3);
  let day = $state('Monday');
  let time = $state('08:00 - 10:30');

  let courses = $derived($courseStore);
  let filteredCourses = $derived(
    courses.filter((c) => {
      const matchQuery =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = filterStatus === 'All' || c.status === filterStatus;
      return matchQuery && matchFilter;
    })
  );

  function handleAddCourse(e: SubmitEvent) {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    addCourse({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      credits: Number(credits),
      lecturer: 'DOSEN',
      day,
      time: time.trim(),
      room: 'SiberMu LMS (Online)',
      studentName: 'MAHASISWA',
      studentId: user.identifierNumber
    });

    code = '';
    name = '';
    credits = 3;
    showModal = false;
  }
</script>

<div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
  <div>
    <h5 class="fw-bold text-dark mb-1">Study Plan (KRS)</h5>
    <p class="text-muted small mb-0">Enroll and manage courses for the current semester</p>
  </div>
  <button type="button" class="btn btn-primary btn-sm px-3" onclick={() => (showModal = true)}>
    + Add Course
  </button>
</div>

<div class="card card-simple overflow-hidden">
  <!-- Search and Dropdown Filter -->
  <div class="p-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 bg-white">
    <input
      type="text"
      class="form-control form-control-sm"
      placeholder="Search course title or code..."
      style="max-width: 250px;"
      bind:value={searchQuery}
    />
    <StatusDropdown selected={filterStatus} onSelect={(val) => (filterStatus = val)} />
  </div>

  <div class="table-responsive">
    <table class="table table-simple table-fixed align-middle">
      <colgroup>
        <col style="width: 12%;" />
        <col style="width: 30%;" />
        <col style="width: 11%;" />
        <col style="width: 14%;" />
        <col style="width: 17%;" />
        <col style="width: 10%;" />
        <col style="width: 6%;" />
      </colgroup>
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
            <td colspan="7" class="text-center py-5 text-muted small">
              No courses found matching your criteria.
            </td>
          </tr>
        {:else}
          {#each filteredCourses as c (c.id)}
            <tr>
              <td class="font-monospace small text-muted">{c.code}</td>
              <td class="fw-semibold text-dark text-truncate" title={c.name}>{c.name}</td>
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

<!-- Modal Add Course -->
{#if showModal}
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(2px);" role="dialog">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 420px;">
      <div class="modal-content border-0 shadow rounded-3">
        <div class="modal-header border-bottom py-2 px-3">
          <h6 class="modal-title fw-bold">Add Course to Plan</h6>
          <button type="button" class="btn-close" aria-label="Close" onclick={() => (showModal = false)}></button>
        </div>
        <form onsubmit={handleAddCourse}>
          <div class="modal-body p-3">
            <div class="row g-2 mb-2">
              <div class="col-4">
                <label for="code" class="form-label small text-muted mb-1">Code</label>
                <input id="code" type="text" class="form-control form-control-sm" placeholder="IF101" bind:value={code} required />
              </div>
              <div class="col-8">
                <label for="name" class="form-label small text-muted mb-1">Title</label>
                <input id="name" type="text" class="form-control form-control-sm" placeholder="Course title" bind:value={name} required />
              </div>
            </div>

            <div class="row g-2 mb-2">
              <div class="col-4">
                <label for="credits" class="form-label small text-muted mb-1">Credits</label>
                <select id="credits" class="form-select form-select-sm" bind:value={credits}>
                  <option value={1}>1 SKS</option>
                  <option value={2}>2 SKS</option>
                  <option value={3}>3 SKS</option>
                  <option value={4}>4 SKS</option>
                </select>
              </div>
              <div class="col-8">
                <label for="day" class="form-label small text-muted mb-1">Day</label>
                <select id="day" class="form-select form-select-sm" bind:value={day}>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
            </div>

            <div class="mb-1">
              <label for="time" class="form-label small text-muted mb-1">Schedule Time</label>
              <input id="time" type="text" class="form-control form-control-sm" placeholder="e.g. 09:00 - 11:30" bind:value={time} />
            </div>
          </div>
          <div class="modal-footer border-top py-2 px-3">
            <button type="button" class="btn btn-outline-secondary btn-sm" onclick={() => (showModal = false)}>Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm px-3">Save Course</button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
