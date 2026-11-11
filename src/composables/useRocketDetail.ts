import { onUnmounted, ref, toValue, watch, type MaybeRefOrGetter } from "vue";
import { isAbortError, rocketApi, toErrorMessage } from "@/api/rocketApi";
import { useRocketStore } from "@/stores/rocketStore";
import type { LoadStatus, Rocket } from "@/types/rocket";

export function useRocketDetail(id: MaybeRefOrGetter<string>) {
  const store = useRocketStore();
  const rocket = ref<Rocket | null>(null);
  const status = ref<LoadStatus>("idle");
  const error = ref<string | null>(null);
  let controller: AbortController | null = null;

  async function load(): Promise<void> {
    controller?.abort();

    const cached = store.findById(toValue(id));
    if (cached) {
      rocket.value = cached;
      status.value = "success";
      return;
    }

    controller = new AbortController();
    status.value = "loading";
    error.value = null;
    try {
      rocket.value = await rocketApi.get(toValue(id), controller.signal);
      status.value = "success";
    } catch (e) {
      if (isAbortError(e)) return;
      error.value = toErrorMessage(e);
      status.value = "error";
    }
  }

  watch(() => toValue(id), load, { immediate: true });
  onUnmounted(() => controller?.abort());

  return { rocket, status, error, load };
}
