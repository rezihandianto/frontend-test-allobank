<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRocketStore } from "@/stores/rocketStore";
import type { NewRocketInput } from "@/types/rocket";
import AddRocketDialog from "@/components/AddRocketDialog.vue";
import AsyncState from "@/components/AsyncState.vue";
import RocketCard from "@/components/RocketCard.vue";
import RocketFilter from "@/components/RocketFilter.vue";

const store = useRocketStore();
const showDialog = ref(false);

onMounted(() => store.fetchRockets());
onUnmounted(() => store.cancel());

function handleAdd(input: NewRocketInput): void {
  store.addRocket(input);
}
</script>

<template>
  <v-container>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h5">SpaceX Rockets</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="showDialog = true"
        >Add rocket</v-btn
      >
    </div>

    <AsyncState
      :status="store.status"
      :error-message="store.error"
      @retry="store.fetchRockets(true)"
    >
      <RocketFilter
        v-model:query="store.query"
        v-model:country="store.country"
        :countries="store.countries"
      />

      <v-alert v-if="store.filtered.length === 0" type="info" variant="tonal">
        No rockets match your filter.
      </v-alert>
      <v-row v-else>
        <v-col
          v-for="rocket in store.filtered"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </AsyncState>

    <AddRocketDialog v-model="showDialog" @submit="handleAdd" />
  </v-container>
</template>
