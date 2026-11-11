export type LoadStatus = "idle" | "loading" | "error" | "success";

export interface Rocket {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  launchCost: number | null;
  country: string | null;
  maidenFlight: string | null;
  isLocal: boolean;
}

export type NewRocketInput = Omit<Rocket, "id" | "isLocal">;

export interface LauncherConfigDto {
  id: number;
  name: string;
  full_name: string | null;
  description: string | null;
  image_url: string | null;
  launch_cost: string | null;
  maiden_flight: string | null;
  manufacturer: { country_code: string | null } | null;
}

export interface LauncherListDto {
  count: number;
  next: string | null;
  results: LauncherConfigDto[];
}
