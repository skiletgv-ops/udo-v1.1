// Service Worker for UDO V2 S2k Clinical Diagnostic Engine (Local-First Offline Layer)

const CACHE_NAME = 'udo-s2k-offline-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[S2k ServiceWorker] Caching core offline shell assets');
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[S2k ServiceWorker] Clearing legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Deterministic S2k Rule Engine running directly inside Service Worker
function evaluateOfflineS2kDiagnosis(text) {
  const query = (text || '').toLowerCase();

  // Rule 1: Acute Ischemic Stroke / Fast Track
  if (
    query.includes('schlaganfall') ||
    query.includes('stroke') ||
    query.includes('hemiparese') ||
    query.includes('aphasie') ||
    query.includes('sehstörung')
  ) {
    return {
      urgency: 'LEVEL_1_CRITICAL',
      icd10: 'I63.9',
      primaryDiagnosis: 'Akuter ischämischer Hirninfarkt (DGN S2k-Leitlinie 2024)',
      recommendedAction: 'Sofortige Einweisung Stroke Unit (Zuweisung innerhalb <60 Min. Zeitfenster für Thrombolyse)',
      bypassedLlm: true,
      goaBillingCode: 'GOÄ 800 + 801 (Neuro-Akutstatus)',
      offlineEngineVersion: 'S2K-SW-THREAD-2026.1'
    };
  }

  // Rule 2: Lumbar Disc Herniation L5/S1
  if (
    query.includes('bandscheibe') ||
    query.includes('radikulopathie') ||
    query.includes('l5') ||
    query.includes('s1') ||
    query.includes('ischias') ||
    query.includes('fußheber')
  ) {
    return {
      urgency: 'LEVEL_2_URGENT',
      icd10: 'M54.16',
      primaryDiagnosis: 'Lumbaler Bandscheibenvorfall L5/S1 mit Wurzelkompression (AWMF S2k)',
      recommendedAction: 'Dringliche Kernspintomographie (MRT LWS) & Elektromyographie (EMG) zur Parese-Graduierung',
      bypassedLlm: false,
      goaBillingCode: 'GOÄ 801 + 806 (Neuro-Funktionsdiagnostik)',
      offlineEngineVersion: 'S2K-SW-THREAD-2026.1'
    };
  }

  // Default S2k Consultation Fallback
  return {
    urgency: 'LEVEL_3_ROUTINE',
    icd10: 'G99.8',
    primaryDiagnosis: 'S2k Klinischer Standardbefund (Offline Service Worker Modus)',
    recommendedAction: 'Ausführliche Erhebung des neurologisch-psychiatrischen Status & Re-Evaluation.',
    bypassedLlm: false,
    goaBillingCode: 'GOÄ 800',
    offlineEngineVersion: 'S2K-SW-THREAD-2026.1'
  };
}

// Handle message events from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'S2K_OFFLINE_DIAGNOSE') {
    const inputQuery = event.data.query || '';
    const result = evaluateOfflineS2kDiagnosis(inputQuery);

    event.ports[0].postMessage({
      status: 'success',
      diagnosticResult: result,
      timestamp: new Date().toISOString()
    });
  }
});
