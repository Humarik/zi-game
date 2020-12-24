export class Controller {
	constructor(model, appHelper) {
		this.model = model;
		this.appHelper = appHelper;
	}

	requestInitAppData() {
		this.model.initAppData();
	}

	defineZombieInvasion() {
		this.model.startZombieInvasion();
	};

	stepZombie(zombie) {
		this.model.stepZombie(zombie);
	}

	leftPlayerStep = ({code}) => {
		if (code === 'KeyA') {
			this.model.specifyPlayerSide('previousElementSibling');
		}
	}

	rightPlayerStep = ({code}) => {
		if (code === 'KeyD') {
			this.model.specifyPlayerSide('nextElementSibling');
		}
	}

	shootByTarget = ({code}) => {
		if (code !== 'Enter') return;

		this.model.shootByTarget();
	}

	refreshGameStatistics() {
		this.model.restartGame();
	}

	setThrottledThrowGrenade(func, delay) {
		this.throttledThrowGrenade = this.appHelper.throttledFunc(func, delay);
	}

	sendElements(grenade, zombie, currentPlayerColumnID) {
		this.model.grenadeMovement(grenade, zombie, currentPlayerColumnID);
	}

	throwGrenade = ({key}) => {
		if (key !== '1') return;

		this.throttledThrowGrenade();
	}
}
