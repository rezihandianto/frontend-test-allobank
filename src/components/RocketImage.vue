<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  src: string | null;
  alt: string;
  height?: number | string;
}>();
const failed = ref(false);
watch(
  () => props.src,
  () => (failed.value = false),
);
</script>

<template>
  <v-img
    v-if="src && !failed"
    :src="src"
    :alt="alt"
    :height="height"
    cover
    @error="failed = true"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular indeterminate size="24" />
      </div>
    </template>
  </v-img>

  <v-sheet
    v-else
    :height="height"
    color="surface-variant"
    class="d-flex flex-column align-center justify-center ga-1"
    role="img"
    :aria-label="`${alt} (no image available)`"
  >
    <v-icon icon="mdi-image-off-outline" size="40" />
    <span class="text-caption">No image</span>
  </v-sheet>
</template>
