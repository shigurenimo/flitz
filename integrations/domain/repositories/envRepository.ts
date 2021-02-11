export interface IEnvRepository {
  getFirebaseEnv(): {
    projectId: string
    clientEmail: string
    privateKey: string
  } | null
}
