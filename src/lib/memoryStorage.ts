// En un entorno serverless, esta es una solución temporal.
// Para un entorno de producción real, se debería usar una base de datos.

export interface VerificationData {
  name: string;
  email: string;
  instagramUrl: string;
  verificationCode: string;
  timestamp: number;
  expiresAt: number;
}

// Variable global para almacenar verificaciones entre ejecuciones
// (Nota: esto se reiniciará si el servidor se reinicia)
let pendingVerificationsMap: Map<string, VerificationData> | null = null;

// Función para obtener el mapa de verificaciones
export function getPendingVerifications(): Map<string, VerificationData> {
  // Si el mapa no existe, lo creamos
  if (!pendingVerificationsMap) {
    pendingVerificationsMap = new Map<string, VerificationData>();
  }
  return pendingVerificationsMap;
}

// Generar un código de verificación aleatorio de 6 dígitos
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Añadir una verificación pendiente
export function addPendingVerification(email: string, data: VerificationData): void {
  const verifications = getPendingVerifications();
  verifications.set(email, data);
}

// Obtener una verificación pendiente
export function getPendingVerification(email: string): VerificationData | undefined {
  const verifications = getPendingVerifications();
  return verifications.get(email);
}

// Eliminar una verificación pendiente
export function removePendingVerification(email: string): boolean {
  const verifications = getPendingVerifications();
  return verifications.delete(email);
}

// Limpiar verificaciones expiradas (útil para ejecutar periódicamente)
export function cleanExpiredVerifications(): number {
  const verifications = getPendingVerifications();
  const now = Date.now();
  let count = 0;
  
  for (const [email, data] of verifications.entries()) {
    if (now > data.expiresAt) {
      verifications.delete(email);
      count++;
    }
  }
  
  return count;
} 