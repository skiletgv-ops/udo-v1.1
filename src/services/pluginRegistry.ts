// Plugin Architecture and Registry for UDO System (TTS, OCR, External Extensions)

export interface UdoPluginContext {
  requestId?: string;
  payload?: any;
  config?: Record<string, any>;
  [key: string]: any;
}

export interface UdoPlugin {
  id: string;
  name: string;
  version: string;
  type: 'tts' | 'ocr' | 'integration' | 'custom';
  description?: string;
  initialize(): Promise<void> | void;
  execute(context: UdoPluginContext): Promise<any> | any;
  cleanup(): Promise<void> | void;
}

class PluginRegistry {
  private static instance: PluginRegistry;
  private plugins: Map<string, UdoPlugin> = new Map();
  private initializedPlugins: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry();
    }
    return PluginRegistry.instance;
  }

  public registerPlugin(plugin: UdoPlugin): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`[PLUGIN REGISTRY] Plugin ${plugin.id} is already registered. Overwriting.`);
    }
    this.plugins.set(plugin.id, plugin);
    console.log(`[PLUGIN REGISTRY] Registered plugin: ${plugin.name} (v${plugin.version}) [Type: ${plugin.type}]`);
  }

  public async initializePlugin(pluginId: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.error(`[PLUGIN REGISTRY] Cannot initialize missing plugin: ${pluginId}`);
      return false;
    }
    if (this.initializedPlugins.has(pluginId)) {
      return true;
    }
    try {
      await plugin.initialize();
      this.initializedPlugins.add(pluginId);
      console.log(`[PLUGIN REGISTRY] Plugin initialized successfully: ${pluginId}`);
      return true;
    } catch (err) {
      console.error(`[PLUGIN REGISTRY] Failed to initialize plugin ${pluginId}:`, err);
      return false;
    }
  }

  public async initializeAll(): Promise<void> {
    for (const id of this.plugins.keys()) {
      await this.initializePlugin(id);
    }
  }

  public async executePlugin<T = any>(pluginId: string, context: UdoPluginContext): Promise<T | null> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      console.error(`[PLUGIN REGISTRY] Plugin not found: ${pluginId}`);
      return null;
    }
    if (!this.initializedPlugins.has(pluginId)) {
      const initialized = await this.initializePlugin(pluginId);
      if (!initialized) {
        throw new Error(`Plugin ${pluginId} failed initialization before execution.`);
      }
    }
    try {
      return await plugin.execute(context);
    } catch (err) {
      console.error(`[PLUGIN REGISTRY] Error executing plugin ${pluginId}:`, err);
      throw err;
    }
  }

  public getPluginsByType(type: UdoPlugin['type']): UdoPlugin[] {
    return Array.from(this.plugins.values()).filter((p) => p.type === type);
  }

  public async unregisterPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      try {
        await plugin.cleanup();
      } catch (err) {
        console.warn(`[PLUGIN REGISTRY] Cleanup error for plugin ${pluginId}:`, err);
      }
      this.initializedPlugins.delete(pluginId);
      this.plugins.delete(pluginId);
      console.log(`[PLUGIN REGISTRY] Unregistered plugin: ${pluginId}`);
    }
  }

  public getAllPlugins(): UdoPlugin[] {
    return Array.from(this.plugins.values());
  }
}

export const pluginRegistry = PluginRegistry.getInstance();
