<script lang="ts">
  import type { User } from '../../types/auth';
  import {
    courseStore,
    totalCreditsStore,
    approvedCreditsStore,
    pendingCoursesStore
  } from '../../stores/dataStore';
  import StatCard from '../common/StatCard.svelte';

  interface Props {
    user: User;
    onNavigate: (tab: string) => void;
  }

  let { user, onNavigate }: Props = $props();

  let courses = $derived($courseStore);
  let totalCredits = $derived($totalCreditsStore);
  let approvedCredits = $derived($approvedCreditsStore);
  let pendingCount = $derived($pendingCoursesStore.length);
</script>

<div class="mb-4">
  <h5 class="fw-bold text-dark mb-1">Academic Overview</h5>
  <p class="text-muted small mb-0">Welcome back, {user.name} ({user.identifierNumber})</p>
</div>

<!-- Dynamic Stat Cards -->
<div class="row g-3 mb-4">
  <div class="col-sm-4">
    <StatCard
      title="Total Credits (SKS)"
      value="{totalCredits} Credits"
      subtitle="Maximum allowed: 24 SKS"
    />
  </div>
  <div class="col-sm-4">
    <StatCard
      title="Approved Credits"
      value="{approvedCredits} Credits"
      subtitle="Verified by academic advisor"
      isPrimary={true}
    />
  </div>
  <div class="col-sm-4">
    <StatCard
      title="Pending Review"
      value="{pendingCount} Courses"
      subtitle="Awaiting lecturer approval"
    />
  </div>
</div>

<!-- Quick Study Plan Table -->
<div class="card card-simple overflow-hidden">
  <div class="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
    <h6 class="fw-bold mb-0">Current Study Plan</h6>
    <button type="button" class="btn btn-primary btn-sm" onclick={() => onNavigate('krs')}>
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
