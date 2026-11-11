import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { isAbortError, rocketApi, toErrorMessage } from "@/api/rocketApi";
import type { LoadStatus, NewRocketInput, Rocket } from "@/types/rocket";

export const useRocketStore = defineStore("rockets", () => {
  const rockets = ref<Rocket[]>([]);
  const status = ref<LoadStatus>("idle");
  const error = ref<string | null>(null);
  const query = ref<string | null>("");
  const country = ref<string | null>(null);
  let controller: AbortController | null = null;

  const countries = computed(() =>
    [
      ...new Set(
        rockets.value.map((r) => r.country).filter((c): c is string => !!c),
      ),
    ].sort(),
  );

  const filtered = computed(() => {
    const q = (query.value ?? "").trim().toLowerCase();
    return rockets.value.filter((r) => {
      const matchesText =
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.description?.toLowerCase().includes(q) ?? false);
      const matchesCountry = !country.value || r.country === country.value;
      return matchesText && matchesCountry;
    });
  });

  async function fetchRockets(force = false): Promise<void> {
    if (status.value === "loading") return;
    if (status.value === "success" && !force) return;

    controller = new AbortController();
    status.value = "loading";
    error.value = null;
    try {
      const remote = await rocketApi.list(controller.signal);
      const local = rockets.value.filter((r) => r.isLocal);
      rockets.value = [...local, ...remote];
      status.value = "success";
    } catch (e) {
      if (isAbortError(e)) return;
      error.value = toErrorMessage(e);
      status.value = "error";
    }
  }

  function cancel(): void {
    controller?.abort();
    if (status.value === "loading") status.value = "idle";
  }

  function addRocket(input: NewRocketInput): Rocket {
    const rocket: Rocket = {
      ...input,
      id: `local-${crypto.randomUUID()}`,
      isLocal: true,
    };
    rockets.value = [rocket, ...rockets.value];
    return rocket;
  }

  function findById(id: string): Rocket | undefined {
    return rockets.value.find((r) => r.id === id);
  }

  return {
    rockets,
    status,
    error,
    query,
    country,
    countries,
    filtered,
    fetchRockets,
    cancel,
    addRocket,
    findById,
  };
});
