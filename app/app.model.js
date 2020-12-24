import {
	DEFAULT_STEP_DELAY,
	DEFAULT_POINTS,
	DEFAULT_LEVEL,
	MIN_QUANTITY_ZOMBIE,
	MAX_QUANTITY_ZOMBIE,
	SIZE_STEP_ZOMBIE,
	SELECTOR_COLUMN,
	SELECTOR_ZOMBIE,
	MAX_TOP,
	SIZE_DOUBLE_STEP,
	HEIGHT_COLUMN,
	DELAY_MOVE_GRENADE,
	MAX_POINTS,
} from './app.constants.js';

export class Model {
	constructor(pubSub, appHelper) {
		this.pubSub = pubSub;
		this.appHelper = appHelper;
		this.stepDelay = DEFAULT_STEP_DELAY;
		this.currentPoints = DEFAULT_POINTS;
		this.levelDifficulty = DEFAULT_LEVEL;
		this.elements = {
			overlayContainer: { id: 'overlay-container', data: {} },
			gameScoresContainer: {
				id: 'game-scores-container',
				data: {
					levelTitle: 'Level',
					levelValue: DEFAULT_LEVEL,
					pointsTitle: 'Points',
					pointsValue: DEFAULT_POINTS,
				},
			},
			fieldContainer: { id: 'field-container', data: {} },
			skillsContainer: { id: 'skills-container', data: {} },
		}
	}

	initAppData() {
		this.pubSub.publish('setElementsData', this.elements);
	}

	startZombieInvasion() {
		this.entervalStepID = setInterval(() => {
			const quantityZombie = this.appHelper.getRandomNumbInRange(MIN_QUANTITY_ZOMBIE, MAX_QUANTITY_ZOMBIE);
			const zombieColumns = this.getZombieColumns(quantityZombie);
			this.pubSub.publish('drawZombieWave', zombieColumns);
		}, this.stepDelay);
	}

	endGame() {
		clearInterval(this.entervalStepID);
		this.pubSub.publish('drawEndGame');
	}

	restartGame() {
		this.currentPoints = DEFAULT_POINTS;
		this.levelDifficulty = DEFAULT_LEVEL;
		this.stepDelay = DEFAULT_STEP_DELAY;
		this.startZombieInvasion();
	}

	getZombieColumns(quantityZombie) {
		const columnNumbers = Object.create(null);

		for (let i = 0; i < quantityZombie; i++) {
			const columnNumber = this.appHelper.getUniqueNumber(columnNumbers);
			columnNumbers[columnNumber] = '';
		}

		return columnNumbers;
	}

	stepZombie(zombie) {
		zombie.forEach((currentZombie) => {
			let zombieTop = this.appHelper.getPositionValue(currentZombie.style.top);

			if (zombieTop === MAX_TOP) {
				this.endGame();
			} else {
				const zombieCurrentTop = zombieTop + SIZE_STEP_ZOMBIE;
				this.pubSub.publish('stepZombie', currentZombie, zombieCurrentTop);
			}
		});
	}

	specifyPlayerSide(pointerSibling) {
		this.pubSub.publish('stepPlayer', pointerSibling);
	}

	shootByTarget() {
		this.increaseCurrentPoints(1);
		this.pubSub.publish('shootByTarget', {
			levelValue: this.levelDifficulty,
			pointsValue: this.currentPoints,
		});
	}

	increaseCurrentPoints(point) {
		this.currentPoints += point;

		if (this.currentPoints === MAX_POINTS) {
			this.currentPoints = DEFAULT_POINTS;
			this.levelUp();
		}
	}

	levelUp() {
		this.stepDelay = this.stepDelay - Math.round(this.stepDelay / 100 * 10);
		this.levelDifficulty += 1;

		clearInterval(this.entervalStepID);
		this.startZombieInvasion();
	}

	filterColumnsByRange(min, max) {
		const [...columns] = document.querySelectorAll(SELECTOR_COLUMN);

		return columns.filter((column, index) => (index >= min && index <= max));
	}

	filterZombieByRange(min, max, column) {
		const [...zombies] = column.querySelectorAll(SELECTOR_ZOMBIE);

		return zombies.filter((zombie) => {
			const zombiePositionTop = this.appHelper.getPositionValue(zombie.style.top);

			return zombiePositionTop >= min && zombiePositionTop <= max;
		});
	}

	getExplosionAreaZombie(columnsByRange, zombieTop) {
		const zombie = [];
		const bottomMaxRange = zombieTop - SIZE_DOUBLE_STEP;
		const topMaxRange = zombieTop + SIZE_DOUBLE_STEP;

		columnsByRange.forEach((column) => {
			zombie.push(...this.filterZombieByRange(bottomMaxRange, topMaxRange, column));
		});

		return zombie;
	}

	getExplosionAreaColumns(columnID) {
		const leftMaxRange = columnID - 2;
		const rightMaxRange = columnID + 2;

		return this.filterColumnsByRange(leftMaxRange, rightMaxRange);
	}

	registerZombieDeletion(zombie) {
		zombie.forEach((currentZombie) => {
			this.increaseCurrentPoints(1);
			this.pubSub.publish('renderGameScores', {
				levelValue: this.levelDifficulty,
				pointsValue: this.currentPoints,
			});
			this.pubSub.publish('removeZombieWithAnimation', currentZombie);
		});
	}

	identifyZombiesInExplosionArea(columnID, zombieTop) {
		const columnsByRange = this.getExplosionAreaColumns(columnID);
		const zombie = this.getExplosionAreaZombie(columnsByRange, zombieTop);
		this.registerZombieDeletion(zombie);
	}

	grenadeMovement(grenade, zombie, currentPlayerColumnID) {
		this.timeIDGrenade = setInterval(() => {
			const hitByTarget = this.isMoveGrenadeToTarget(grenade, zombie);

			if (hitByTarget) {
				const zombiePositionTop = this.appHelper.getPositionValue(zombie.style.top);
				this.identifyZombiesInExplosionArea(currentPlayerColumnID - 1, zombiePositionTop);
				this.pubSub.publish('removeElement', grenade);
				clearInterval(this.timeIDGrenade);
			}
		}, DELAY_MOVE_GRENADE);
	}

	moveGrenade(grenade) {
		const grenadePositionBottom = this.appHelper.getPositionValue(grenade.style.bottom);
		const nextGrenadePositionBottom = grenadePositionBottom + SIZE_STEP_ZOMBIE;
		this.pubSub.publish('moveGrenade', grenade, nextGrenadePositionBottom);

		if (nextGrenadePositionBottom >= HEIGHT_COLUMN) {
			this.pubSub.publish('removeElement', grenade);
			clearInterval(this.timeIDGrenade);
		}
	}

	isMoveGrenadeToTarget(grenade, zombie) {
		this.moveGrenade(grenade);

		if (!zombie) return false;

		const zombieTop = this.appHelper.getPositionValue(zombie.style.top);
		const grenadeBottom = this.appHelper.getPositionValue(grenade.style.bottom);

		return zombieTop + grenadeBottom + SIZE_STEP_ZOMBIE >= HEIGHT_COLUMN;
	}
}
