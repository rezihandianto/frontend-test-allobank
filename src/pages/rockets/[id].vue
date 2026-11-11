<script setup lang="ts">
import { useRoute } from "vue-router/auto";
import { useRocketDetail } from "@/composables/useRocketDetail";
import {
  FALLBACK_TEXT,
  NO_DESCRIPTION,
  formatCurrency,
  formatDate,
} from "@/utils/format";
import AsyncState from "@/components/AsyncState.vue";
import RocketImage from "@/components/RocketImage.vue";

const route = useRoute("/rockets/[id]");
const { rocket, status, error, load } = useRocketDetail(() => route.params.id);
</script>

<template>
  <v-container>
    <v-btn to="/" variant="text" prepend-icon="mdi-arrow-left" class="mb-4"
      >Back to rockets</v-btn
    >

    <AsyncState :status="status" :error-message="error" @retry="load">
      <v-card v-if="rocket">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <RocketImage
              :src="rocket.imageUrl"
              :alt="rocket.name"
              :height="360"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-card-title class="text-h5 text-wrap">{{
              rocket.name
            }}</v-card-title>
            <v-card-text class="description">{{
              rocket.description ?? NO_DESCRIPTION
            }}</v-card-text>
            <v-list lines="one">
              <v-list-item
                prepend-icon="mdi-cash"
                title="Cost per launch"
                :subtitle="formatCurrency(rocket.launchCost)"
              />
              <v-list-item
                prepend-icon="mdi-flag"
                title="Country"
                :subtitle="rocket.country ?? FALLBACK_TEXT"
              />
              <v-list-item
                prepend-icon="mdi-calendar"
                title="First flight"
                :subtitle="formatDate(rocket.maidenFlight)"
              />
            </v-list>
          </v-col>
        </v-row>
      </v-card>
    </AsyncState>
  </v-container>
</template>

<style scoped>
.description {
  white-space: pre-line;
}
</style>
