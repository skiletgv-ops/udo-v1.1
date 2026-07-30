// Persistent Vector Memory Service (Pinecone / pgvector / In-Memory Cosine Similarity Store)

export interface VectorEntry {
  id: string;
  type: 'conversation' | 'preference' | 'document' | 'clinical_note';
  text: string;
  vector?: number[];
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface VectorSearchResult {
  entry: VectorEntry;
  score: number;
}

const VECTOR_STORAGE_KEY = 'udo_vector_memory_v1';

class VectorMemoryService {
  private static instance: VectorMemoryService;
  private entries: VectorEntry[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): VectorMemoryService {
    if (!VectorMemoryService.instance) {
      VectorMemoryService.instance = new VectorMemoryService();
    }
    return VectorMemoryService.instance;
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(VECTOR_STORAGE_KEY);
      if (stored) {
        this.entries = JSON.parse(stored);
      }
    } catch (e) {
      this.entries = [];
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(VECTOR_STORAGE_KEY, JSON.stringify(this.entries.slice(0, 300)));
    } catch (e) {
      // Ignore storage quota errors
    }
  }

  // Simple TF-IDF / Cosine Similarity embedding generator fallback for client-side matching
  private generateMockEmbedding(text: string): number[] {
    const vector = new Array(32).fill(0);
    const cleaned = text.toLowerCase();
    for (let i = 0; i < cleaned.length; i++) {
      const charCode = cleaned.charCodeAt(i);
      vector[i % 32] += (charCode % 10) / 10;
    }
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
    return vector.map((val) => val / norm);
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  public storeEntry(
    type: VectorEntry['type'],
    text: string,
    metadata?: Record<string, any>
  ): VectorEntry {
    const vector = this.generateMockEmbedding(text);
    const entry: VectorEntry = {
      id: `VEC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      text,
      vector,
      metadata,
      timestamp: new Date().toISOString(),
    };

    this.entries.unshift(entry);
    this.saveToStorage();
    return entry;
  }

  public searchSimilar(query: string, type?: VectorEntry['type'], topK: number = 3): VectorSearchResult[] {
    const queryVector = this.generateMockEmbedding(query);
    const filtered = type ? this.entries.filter((e) => e.type === type) : this.entries;

    const scored = filtered.map((entry) => {
      const score = entry.vector ? this.cosineSimilarity(queryVector, entry.vector) : 0;
      return { entry, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  public getEntries(type?: VectorEntry['type']): VectorEntry[] {
    return type ? this.entries.filter((e) => e.type === type) : [...this.entries];
  }

  public clearMemory() {
    this.entries = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(VECTOR_STORAGE_KEY);
    }
  }
}

export const vectorMemoryService = VectorMemoryService.getInstance();
