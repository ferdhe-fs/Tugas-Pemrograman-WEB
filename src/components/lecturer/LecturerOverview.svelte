<script lang="ts">
  import type { User } from '../../types/auth';
  import {
    courseStore,
    pendingCoursesStore,
    approvedCoursesStore
  } from '../../stores/dataStore';
  import StatCard from '../common/StatCard.svelte';

  interface Props {
    user: User;
    onNavigate: (tab: string) => void;
  }

  let { user, onNavigate }: Props = $props();

  let courses = $derived($courseStore);
  let pendingCount = $derived($pendingCoursesStore.length);
  let approvedCount = $derived($approvedCoursesStore.length);
</script>

<div class="mb-4">
  <h5 class="fw-bold text-dark mb-1">Teaching & Advising Overview</h5>
  <p class="text-muted small mb-0">Welcome, {user.name} ({user.identifierNumber})</p>
</div>

<!-- Dynamic Stat Cards -->
<div class="row g-3 mb-4">
  <div class="col-sm-4">
    <StatCard
      title="Pending Approvals"
      value="{pendingCount} Requests"
      subtitle="Awaiting your validation"
      isPrimary={true}
    />
  </div>
  <div class="col-sm-4">
    <StatCard
      title="Approved Enrollments"
      value="{approvedCount} Approved"
      subtitle="Verified study plans"
    />
  </div>
  <div class="col-sm-4">
    <StatCard
      title="Total Course Enrollments"
      value="{courses.length} Courses"
      subtitle="Across all advisees"
    />
  </div>
</div>

<div class="card card-simple p-4 text-center">
  <h6 class="fw-bold mb-1">Validate Student Study Plans</h6>
  <p class="text-muted small mb-3">Review and approve course registrations submitted by advised students.</p>
  <div>
    <button type="button" class="btn btn-primary btn-sm px-4" onclick={() => onNavigate('approval')}>
      Go to KRS Approval &rarr;
    </button>
  </div>
</div>
