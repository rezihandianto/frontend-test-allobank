<script setup lang="ts">
import type { Rocket } from "@/types/rocket";
import { NO_DESCRIPTION } from "@/utils/format";
import RocketImage from "./RocketImage.vue";

defineProps<{ rocket: Rocket }>();
</script>

<template>
  <v-card :to="`/rockets/${rocket.id}`" hover height="100%">
    <RocketImage :src="rocket.imageUrl" :alt="rocket.name" :height="180" />
    <v-card-title class="text-wrap">
      {{ rocket.name }}
      <v-chip v-if="rocket.isLocal" size="x-small" color="primary" class="ml-1"
        >New</v-chip
      >
    </v-card-title>
    <v-card-text class="clamp text-medium-emphasis">
      {{ rocket.description ?? NO_DESCRIPTION }}
    </v-card-text>
  </v-card>
</template>

<style scoped>
.clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
