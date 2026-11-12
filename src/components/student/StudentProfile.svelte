<script lang="ts">
  import type { User } from '../../types/auth';

  interface Props {
    user: User;
  }

  let { user }: Props = $props();
</script>

<div class="mb-3">
  <h5 class="fw-bold text-dark mb-1">Student Profile</h5>
  <p class="text-muted small mb-0">Official student identity and registration records</p>
</div>

<div class="card card-simple p-4">
  <div class="row g-3">
    <div class="col-sm-6">
      <label for="profName" class="form-label small text-muted">Full Name</label>
      <input id="profName" class="form-control form-control-sm" value={user.name} readonly />
    </div>
    <div class="col-sm-6">
      <label for="profNim" class="form-label small text-muted">Student ID (NIM)</label>
      <input id="profNim" class="form-control form-control-sm font-monospace" value={user.identifierNumber} readonly />
    </div>
    <div class="col-sm-6">
      <label for="profDept" class="form-label small text-muted">Study Program</label>
      <input id="profDept" class="form-control form-control-sm" value={user.department} readonly />
    </div>
    <div class="col-sm-6">
      <label for="profEmail" class="form-label small text-muted">Email Address</label>
      <input id="profEmail" class="form-control form-control-sm" value={user.email} readonly />
    </div>
    <div class="col-12">
      <label for="profInst" class="form-label small text-muted">Institution</label>
      <input id="profInst" class="form-control form-control-sm" value="Cyber Muhammadiyah University (Universitas Siber Muhammadiyah)" readonly />
    </div>
  </div>
</div>
