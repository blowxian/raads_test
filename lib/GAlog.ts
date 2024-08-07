// /lib/GALog.ts

/**
 * 发送事件到 Google Analytics
 * @param {string} action - 表示交互类型的字符串（例如 'click'）
 * @param {string} category - 事件类别（例如 'Video'）
 * @param {string} label - 事件标签（例如 'play'）
 * @param {number} value - 事件的数值（例如持续时间）
 */
export const logEvent = (action: string, category: string, label: string, value: number): void => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}