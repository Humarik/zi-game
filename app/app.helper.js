export class Helper {
	getUniqueNumber(numbers) {
		const number = this.getRandomNumbInRange(1, 7);

		if (numbers[number]) {
			return this.getUniqueNumber(numbers);
		}

		return String(number);
	}

	getPositionValue(string) {
		const positionValue = string.replace('px', '');

		return Number(positionValue);
	}

	getRandomNumbInRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	throttledFunc(func, delay) {
		let isThrottle = false;

		return () => {
			if (!isThrottle) {
				func();
				isThrottle = true;

				setTimeout(() => {
					isThrottle = false;
				}, delay);
			}
		};
	}
}
