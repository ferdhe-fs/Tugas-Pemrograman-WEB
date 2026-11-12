<script lang="ts">
  import { courseStore } from '../../stores/dataStore';

  let courses = $derived($courseStore);
</script>

<div class="mb-3">
  <h5 class="fw-bold text-dark mb-1">Weekly Course Schedule</h5>
  <p class="text-muted small mb-0">Synchronous lectures and laboratory sessions via SiberMu LMS</p>
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
        {#if courses.length === 0}
          <tr>
            <td colspan="6" class="text-center py-5 text-muted small">No scheduled courses available.</td>
          </tr>
        {:else}
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
        {/if}
      </tbody>
    </table>
  </div>
</div>
