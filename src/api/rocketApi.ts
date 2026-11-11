import type {
  LauncherConfigDto,
  LauncherListDto,
  Rocket,
} from "@/types/rocket";

const BASE_URL = "https://lldev.thespacedevs.com/2.2.0/config/launcher/";
const LIST_URL = `${BASE_URL}?manufacturer__name=SpaceX&mode=detailed&limit=20`;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 404) return "Rocket not found.";
    if (error.status === 429)
      return "Rate limit reached. Please try again later.";
    return `Request failed (${error.status ?? "unknown"}).`;
  }
  if (error instanceof TypeError)
    return "Network error. Check your connection and retry.";
  return "Something went wrong. Please retry.";
}

async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new ApiError(response.statusText, response.status);
  return (await response.json()) as T;
}

function parseCost(raw: string | null): number | null {
  if (raw == null || raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function toRocket(dto: LauncherConfigDto): Rocket {
  return {
    id: String(dto.id),
    name: dto.full_name?.trim() || dto.name,
    description: dto.description?.trim() || null,
    imageUrl: dto.image_url || null,
    launchCost: parseCost(dto.launch_cost),
    country: dto.manufacturer?.country_code || null,
    maidenFlight: dto.maiden_flight || null,
    isLocal: false,
  };
}

export const rocketApi = {
  async list(signal?: AbortSignal): Promise<Rocket[]> {
    const data = await request<LauncherListDto>(LIST_URL, signal);
    return data.results.map(toRocket);
  },
  async get(id: string, signal?: AbortSignal): Promise<Rocket> {
    const data = await request<LauncherConfigDto>(
      `${BASE_URL}${encodeURIComponent(id)}/`,
      signal,
    );
    return toRocket(data);
  },
};
