<script lang="ts">
  interface Props {
    show: boolean;
    onCancel: () => void;
    onConfirm: () => void;
  }

  let { show, onCancel, onConfirm }: Props = $props();
</script>

{#if show}
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(2px);" role="dialog">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 380px;">
      <div class="modal-content border-0 shadow-lg rounded-4 p-3 text-center">
        <div class="my-2">
          <div class="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle p-3 mb-2">
            <i class="bi bi-box-arrow-right fs-3"></i>
          </div>
          <h5 class="fw-bold text-dark mb-1">Confirm Logout</h5>
          <p class="text-muted small mb-3">Are you sure you want to sign out from your account session?</p>
        </div>
        <div class="d-flex gap-2 justify-content-center">
          <button type="button" class="btn btn-light px-4 py-2 small fw-semibold" onclick={onCancel}>
            Cancel
          </button>
          <button type="button" class="btn btn-danger px-4 py-2 small fw-semibold" onclick={onConfirm}>
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
