<script lang="ts">
  interface Props {
    title: string;
    value: string | number;
    subtitle?: string;
    isPrimary?: boolean;
  }

  let { title, value, subtitle, isPrimary = false }: Props = $props();
</script>

<div class="card card-simple p-3 h-100">
  <div class="text-muted small">{title}</div>
  <div class="fs-4 fw-bold mt-1 {isPrimary ? 'text-primary' : 'text-dark'}">
    {value}
  </div>
  {#if subtitle}
    <div class="small text-muted mt-1">{subtitle}</div>
  {/if}
</div>
