<script lang="ts">
  import { computeTranscripts } from '../../stores/dataStore';

  const transcripts = computeTranscripts();

  let selectedSemester = $state<number>(1);
  let currentSemesterData = $derived(
    transcripts.find((s) => s.semester === selectedSemester) || transcripts[0]!
  );

  // Dynamic Cumulative GPA (IPK) calculation
  let cumulativeCredits = $derived(
    transcripts.reduce((sum, s) => sum + s.totalCredits, 0)
  );
  let cumulativePoints = $derived(
    transcripts.reduce(
      (sum, s) => sum + s.courses.reduce((cSum, c) => cSum + c.credits * c.point, 0),
      0
    )
  );
  let cumulativeGpa = $derived(
    cumulativeCredits > 0 ? (cumulativePoints / cumulativeCredits).toFixed(2) : '0.00'
  );
</script>

<div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
  <div>
    <h5 class="fw-bold text-dark mb-1">Academic Transcript by Semester</h5>
    <p class="text-muted small mb-0">Official grades, credit achievements, and GPA history</p>
  </div>
  <div class="d-flex gap-2">
    {#each transcripts as st}
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

<!-- Dynamic Summary Cards -->
<div class="row g-3 mb-3">
  <div class="col-sm-4">
    <div class="card card-simple p-3 text-center">
      <div class="text-muted small">Semester GPA</div>
      <div class="fs-3 fw-bold text-primary mt-1">{currentSemesterData.semesterGpa.toFixed(2)}</div>
      <div class="text-muted small">{currentSemesterData.academicYear}</div>
    </div>
  </div>
  <div class="col-sm-4">
    <div class="card card-simple p-3 text-center">
      <div class="text-muted small">Semester Credits</div>
      <div class="fs-3 fw-bold text-dark mt-1">{currentSemesterData.totalCredits} SKS</div>
      <div class="text-muted small">Completed</div>
    </div>
  </div>
  <div class="col-sm-4">
    <div class="card card-simple p-3 text-center">
      <div class="text-muted small">Cumulative GPA (IPK)</div>
      <div class="fs-3 fw-bold text-dark mt-1">{cumulativeGpa}</div>
      <div class="text-muted small">{cumulativeCredits} SKS Completed Total</div>
    </div>
  </div>
</div>

<!-- Transcript Table -->
<div class="card card-simple overflow-hidden">
  <div class="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
    <h6 class="fw-bold mb-0">Semester {currentSemesterData.semester} Grades</h6>
    <span class="badge badge-clean-primary">{currentSemesterData.academicYear}</span>
  </div>

  <div class="table-responsive">
    <table class="table table-simple table-fixed align-middle">
      <colgroup>
        <col style="width: 7%;" />
        <col style="width: 18%;" />
        <col style="width: 38%;" />
        <col style="width: 15%;" />
        <col style="width: 11%;" />
        <col style="width: 11%;" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-start">No</th>
          <th class="text-start">Course Code</th>
          <th class="text-start">Course Title</th>
          <th class="text-start">Credits (SKS)</th>
          <th class="text-start">Grade</th>
          <th class="text-start">Grade Point</th>
        </tr>
      </thead>
      <tbody>
        {#each currentSemesterData.courses as crs, idx}
          <tr>
            <td class="text-start text-muted small">{idx + 1}</td>
            <td class="text-start font-monospace small text-muted">{crs.code}</td>
            <td class="text-start fw-semibold text-dark text-truncate" title={crs.name}>{crs.name}</td>
            <td class="text-start">{crs.credits}</td>
            <td class="text-start">
              <span class="badge badge-clean-primary px-2 py-1">{crs.grade}</span>
            </td>
            <td class="text-start fw-semibold font-monospace">{crs.point.toFixed(2)}</td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr class="table-light fw-semibold">
          <td colspan="3" class="text-start">Semester Summary</td>
          <td class="text-start">{currentSemesterData.totalCredits} SKS</td>
          <td colspan="2" class="text-start">
            Semester GPA: <span class="text-primary">{currentSemesterData.semesterGpa.toFixed(2)}</span>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>
