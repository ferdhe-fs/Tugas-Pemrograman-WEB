<script lang="ts">
  interface Props {
    selected: 'All' | 'Pending' | 'Approved';
    onSelect: (val: 'All' | 'Pending' | 'Approved') => void;
  }

  let { selected, onSelect }: Props = $props();
  let isOpen = $state(false);

  const options: Array<'All' | 'Pending' | 'Approved'> = ['All', 'Pending', 'Approved'];
</script>

<div class="filter-dropdown-container">
  <button
    type="button"
    class="filter-dropdown-btn"
    onclick={() => (isOpen = !isOpen)}
  >
    <span>{selected}</span>
    <i class="bi bi-chevron-down small text-muted ms-1"></i>
  </button>

  {#if isOpen}
    <button
      type="button"
      class="filter-dropdown-backdrop"
      aria-label="Close filter menu"
      tabindex="-1"
      onclick={() => (isOpen = false)}
    ></button>

    <div class="filter-dropdown-menu">
      {#each options as opt}
        <button
          type="button"
          class="filter-item {selected === opt ? 'selected' : ''}"
          onclick={() => { onSelect(opt); isOpen = false; }}
        >
          <span>{opt}</span>
          {#if selected === opt}
            <i class="bi bi-check2 text-primary ms-auto"></i>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
