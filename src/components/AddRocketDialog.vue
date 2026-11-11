<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { VForm } from "vuetify/components";
import type { NewRocketInput } from "@/types/rocket";

const open = defineModel<boolean>({ required: true });
const emit = defineEmits<{ submit: [input: NewRocketInput] }>();

const formRef = ref<VForm | null>(null);
const form = reactive({
  name: "",
  description: "",
  imageUrl: "",
  country: "",
  launchCost: "",
  maidenFlight: "",
});

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

const rules = {
  name: [(v: string) => !!v.trim() || "Name is required"],
  imageUrl: [
    (v: string) =>
      !v.trim() || isHttpUrl(v.trim()) || "Enter a valid http(s) URL",
  ],
  launchCost: [
    (v: string) =>
      v === "" || Number(v) >= 0 || "Must be a non-negative number",
  ],
};

function reset(): void {
  Object.assign(form, {
    name: "",
    description: "",
    imageUrl: "",
    country: "",
    launchCost: "",
    maidenFlight: "",
  });
  formRef.value?.resetValidation();
}

watch(open, (isOpen) => {
  if (!isOpen) reset();
});

async function onSubmit(): Promise<void> {
  const { valid } = (await formRef.value?.validate()) ?? { valid: false };
  if (!valid) return;
  emit("submit", {
    name: form.name.trim(),
    description: form.description.trim() || null,
    imageUrl: form.imageUrl.trim() || null,
    country: form.country.trim().toUpperCase() || null,
    launchCost: form.launchCost === "" ? null : Number(form.launchCost),
    maidenFlight: form.maidenFlight || null,
  });
  open.value = false;
}
</script>

<template>
  <v-dialog v-model="open" max-width="640">
    <v-card title="Add rocket">
      <v-card-text>
        <v-form ref="formRef" @submit.prevent="onSubmit">
          <v-row dense>
            <v-col cols="12" sm="8">
              <v-text-field
                v-model="form.name"
                label="Name *"
                :rules="rules.name"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="form.country"
                label="Country code"
                placeholder="USA"
                maxlength="3"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                rows="3"
                auto-grow
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.imageUrl"
                label="Image URL"
                type="url"
                :rules="rules.imageUrl"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.launchCost"
                label="Cost per launch (USD)"
                type="number"
                min="0"
                :rules="rules.launchCost"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.maidenFlight"
                label="First flight"
                type="date"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="open = false">Cancel</v-btn>
        <v-btn color="primary" variant="flat" @click="onSubmit"
          >Add rocket</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
