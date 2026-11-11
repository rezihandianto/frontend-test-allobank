<script setup lang="ts">
defineProps<{ countries: string[] }>();
const query = defineModel<string | null>("query", { required: true });
const country = defineModel<string | null>("country", { required: true });
</script>

<template>
  <v-row dense class="mb-2">
    <v-col cols="12" sm="8">
      <v-text-field
        v-model="query"
        label="Search rockets"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        clearable
        hide-details
      />
    </v-col>
    <v-col cols="12" sm="4">
      <v-select
        v-model="country"
        :items="countries"
        label="Country"
        variant="outlined"
        density="comfortable"
        clearable
        hide-details
      />
    </v-col>
  </v-row>
</template>
