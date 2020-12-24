import {
	SELECTOR_PLAYER_SHOT,
	SELECTOR_ZOMBIE_HIT,
	SELECTOR_COOLDOWN,
	SECONDS_COOLDOWN_GRENADE,
	CLASS_NAME_PLAYER_SHOT,
	CLASS_NAME_PLAYER_SHOT_HIDE,
	CLASS_NAME_ZOMBIE_HIT_SHOW,
	CLASS_NAME_PLAYER_SHOT_SHOW,
	CLASS_NAME_ZOMBIE_HIT_HIDE,
	CLASS_NAME_ZOMBIE_HIT,
	CLASS_NAME_LOADER,
} from './app.constants.js';

export class GameViewService {
	createDivElement(className) {
		const divElement = document.createElement('div');
		divElement.classList.add(className);

		return divElement;
	}

	showPlayerShot() {
		const playerFire = document.querySelector(SELECTOR_PLAYER_SHOT);
		playerFire.classList.remove(CLASS_NAME_PLAYER_SHOT_HIDE);
		playerFire.classList.add(CLASS_NAME_PLAYER_SHOT_SHOW);
	}

	hidePlayerShotInDelay(delay) {
		setTimeout(() => {
			const playerFire = document.querySelector(SELECTOR_PLAYER_SHOT);
			playerFire.classList.remove(CLASS_NAME_PLAYER_SHOT_SHOW);
			playerFire.classList.add(CLASS_NAME_PLAYER_SHOT_HIDE);
		}, delay);
	}

	showHitByTarget(target) {
		const hit = target.querySelector(SELECTOR_ZOMBIE_HIT);
		hit.classList.remove(CLASS_NAME_ZOMBIE_HIT_HIDE);
		hit.classList.add(CLASS_NAME_ZOMBIE_HIT_SHOW);
	}

	createPlayerShot() {
		const playerShot = document.createElement('div');
		playerShot.className = CLASS_NAME_PLAYER_SHOT;
		playerShot.classList.add(CLASS_NAME_PLAYER_SHOT_HIDE);

		return playerShot;
	}

	createHitByZombie() {
		const hit = document.createElement('div');
		hit.className = CLASS_NAME_ZOMBIE_HIT;
		hit.classList.add(CLASS_NAME_ZOMBIE_HIT_HIDE);

		return hit;
	}

	loader() {
		const cooldown = document.querySelector(SELECTOR_COOLDOWN);

		setTimeout(() => {
			cooldown.classList.add(CLASS_NAME_LOADER);
		});

		setTimeout(() => {
			cooldown.classList.remove(CLASS_NAME_LOADER);
		}, SECONDS_COOLDOWN_GRENADE);
	}
}
