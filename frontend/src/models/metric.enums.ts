/** Metric keys as the API names them; they double as `order_by` values. */
export enum MetricKey {
  MinutesPlayed = 'minutes_played',
  TotalDistanceM = 'total_distance_m',
  HighSpeedRunningM = 'high_speed_running_m',
  Sprints = 'sprints',
  MaxSpeedKmh = 'max_speed_kmh',
  Accelerations = 'accelerations',
  Rpe = 'rpe',
  WorkloadAu = 'workload_au',
}

export enum AlertLevel {
  Warning = 'warning',
  Critical = 'critical',
}
