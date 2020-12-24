export class PubSub {
	constructor() {
		this.listeners = [];
	}

	subscribe(eventName, func) {
		this.listeners.push({ eventName, func });
	}

	removeSubscribers(eventName, func) {
		this.listeners = this.listeners.filter((listener) => (
			listener.eventName !== eventName ||
			listener.func !== func
		));
	}

	publish(eventName, ...data) {
		this.listeners.forEach((listener) => {
			if (listener.eventName === eventName) {
				listener.func(...data);
			}
		})
	}
}
