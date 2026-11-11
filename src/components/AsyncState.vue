<script setup lang="ts">
import type { LoadStatus } from "@/types/rocket";

defineProps<{ status: LoadStatus; errorMessage?: string | null }>();
defineEmits<{ retry: [] }>();
</script>

<template>
  <div
    v-if="status === 'loading'"
    class="d-flex flex-column align-center ga-3 py-12"
    role="status"
    aria-live="polite"
  >
    <v-progress-circular indeterminate color="primary" size="48" />
    <span class="text-medium-emphasis">Loading…</span>
  </div>

  <v-alert
    v-else-if="status === 'error'"
    type="error"
    variant="tonal"
    class="my-6"
  >
    {{ errorMessage ?? "Something went wrong." }}
    <template #append>
      <v-btn
        variant="outlined"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
        >Retry</v-btn
      >
    </template>
  </v-alert>

  <slot v-else-if="status === 'success'" />
</template>
