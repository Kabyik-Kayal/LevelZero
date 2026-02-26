// ============================================
// LevelZero — EventBus (Pub/Sub)
// Decoupled communication between game modules
// ============================================

export class EventBus {
  constructor() {
    this._listeners = {};
  }

  /**
   * Subscribe to an event
   * @param {string} event
   * @param {Function} callback
   * @returns {Function} unsubscribe function
   */
  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   */
  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
  }

  /**
   * Emit an event with data
   */
  emit(event, data) {
    if (!this._listeners[event]) return;
    this._listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`[EventBus] Error in listener for "${event}":`, err);
      }
    });
  }

  /**
   * Subscribe to an event, auto-unsubscribe after first emission
   */
  once(event, callback) {
    const unsub = this.on(event, (data) => {
      unsub();
      callback(data);
    });
    return unsub;
  }
}

// Singleton instance
export const eventBus = new EventBus();
