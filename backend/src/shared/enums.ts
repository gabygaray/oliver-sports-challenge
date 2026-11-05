export enum SessionType {
    Training = 'training',
    Match = 'match',
}

/** Metric columns of player_sessions that can be sorted, charted or thresholded. */
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

export enum ReportKind {
    Session = 'session',
    PlayerEvolution = 'player_evolution',
}
