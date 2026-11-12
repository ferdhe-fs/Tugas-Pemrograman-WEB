<script lang="ts">
  import type { User } from '../../types/auth';

  interface Props {
    user: User;
  }

  let { user }: Props = $props();
</script>

<div class="mb-3">
  <h5 class="fw-bold text-dark mb-1">Lecturer Profile</h5>
  <p class="text-muted small mb-0">Official faculty information and registration details</p>
</div>

<div class="card card-simple p-4">
  <div class="row g-3">
    <div class="col-sm-6">
      <label for="profLecName" class="form-label small text-muted">Full Name</label>
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
      <label for="profLecEmail" class="form-label small text-muted">Email Address</label>
      <input id="profLecEmail" class="form-control form-control-sm" value={user.email} readonly />
    </div>
    <div class="col-12">
      <label for="profLecFaculty" class="form-label small text-muted">Faculty & Institution</label>
      <input id="profLecFaculty" class="form-control form-control-sm" value="Faculty of Science & Technology - Cyber Muhammadiyah University" readonly />
    </div>
  </div>
</div>
