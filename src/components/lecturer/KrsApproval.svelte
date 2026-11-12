<script lang="ts">
  import { courseStore, setCourseStatus } from '../../stores/dataStore';
  import StatusDropdown from '../common/StatusDropdown.svelte';

  let filterStatus = $state<'All' | 'Pending' | 'Approved'>('All');

  let courses = $derived($courseStore);
  let filteredCourses = $derived(
    courses.filter((c) => (filterStatus === 'All' ? true : c.status === filterStatus))
  );
</script>

<div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
  <div>
    <h5 class="fw-bold text-dark mb-1">KRS Approval & Validation</h5>
    <p class="text-muted small mb-0">Review student course plans and toggle verification status</p>
  </div>
  <StatusDropdown selected={filterStatus} onSelect={(val) => (filterStatus = val)} />
</div>

<div class="card card-simple overflow-hidden">
  <div class="table-responsive">
    <table class="table table-simple">
      <thead>
        <tr>
          <th>Student (Applicant)</th>
          <th>Course Details</th>
          <th>Credits</th>
          <th>Schedule</th>
          <th>Status</th>
          <th class="text-end">Action</th>
        </tr>
      </thead>
      <tbody>
        {#if filteredCourses.length === 0}
          <tr>
            <td colspan="6" class="text-center py-5 text-muted small">
              No course submissions found in this category.
            </td>
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
