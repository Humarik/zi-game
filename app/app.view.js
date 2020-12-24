import { appTemplate, gameScoresTemplate, fieldContainer, grenadeSkill, overlay } from './templates/index.js';

import {
	SECONDS_COOLDOWN_GRENADE,
	SELECTOR_ROOT,
	SELECTOR_PLAYER,
	SELECTOR_RESTART_GAME,
	SELECTOR_OVERLAY,
	SELECTOR_GAME_END,
	CLASS_NAME_OVERLAY_SHOW,
	CLASS_NAME_GAME_END_SHOW,
	SELECTOR_ZOMBIE,
	DEFAULT_POINTS,
	DEFAULT_LEVEL,
	DEFAULT_PLAYER_PLACE_ID,
	CLASS_NAME_ZOMBIE,
	SELECTOR_FIELD_COLUMN,
	CLASS_NAME_GRENADE,
	DEFAULT_BOTTOM,
	DEFAULT_TOP,
	DELAY_ANIMATION_REMOVE,
	DELAY_ANIMATION_HIDE_SHOT,
	DELAY_ANIMATION_DRAW_ZOMBIE
} from './app.constants.js';

export class View {
	constructor(controller, pubSub, gameViewService, gameSoundService) {
		this.controller = controller;
		this.pubSub = pubSub;
		this.gameViewService = gameViewService;
		this.gameSoundService = gameSoundService;

		this.initSubscribers();

		this.rootElement = document.getElementById(SELECTOR_ROOT);
		this.renderView();

		this.playerElement = document.querySelector(SELECTOR_PLAYER);
		this.addPlayerShot();

		this.controller.setThrottledThrowGrenade(this.throwGrenade, SECONDS_COOLDOWN_GRENADE);

		this.initListeners();
	}

	initSubscribers() {
		this.pubSub.subscribe('setElementsData', this.setElementsData);
		this.pubSub.subscribe('stepPlayer', this.stepPlayer);
		this.pubSub.subscribe('stepZombie', this.stepZombie);
		this.pubSub.subscribe('shootByTarget', this.shootByTarget);
		this.pubSub.subscribe('drawEndGame', this.drawEndGame);
		this.pubSub.subscribe('moveGrenade', this.moveGrenade);
		this.pubSub.subscribe('removeElement', this.removeElement);
		this.pubSub.subscribe('removeZombieWithAnimation', this.removeZombieWithAnimation);
		this.pubSub.subscribe('renderGameScores', this.renderGameScores);
		this.pubSub.subscribe('drawZombieWave', this.drawZombieWave);
	}

	initListeners() {
		document.addEventListener('keyup', this.controller.rightPlayerStep);
		document.addEventListener('keyup', this.controller.leftPlayerStep);
		document.addEventListener('keyup', this.controller.shootByTarget);
		document.addEventListener('keyup', this.controller.throwGrenade);
		document.querySelector(SELECTOR_RESTART_GAME).addEventListener('click', this.redrawGame);
	}

	setElementsData = (elementsData) => {
		this.elements = elementsData;
	}

	renderView() {
		const appHtml = appTemplate();
		this.rootElement.innerHTML = appHtml;
		this.controller.requestInitAppData();

		this.renderGameScores();
		this.renderFieldGame();
		this.renderGrenadeSkill();
		this.renderOverlay();
	}

	renderGameScores = (data) => {
		if (data) {
			Object.assign(this.elements.gameScoresContainer.data, data);
		}

		const html = gameScoresTemplate(this.elements.gameScoresContainer.data);
		const elementID = this.elements.gameScoresContainer.id;
		document.getElementById(elementID).innerHTML = html;
	}

	renderFieldGame() {
		const html = fieldContainer();
		const elementID = this.elements.fieldContainer.id;
		document.getElementById(elementID).innerHTML = html;
	}

	renderGrenadeSkill() {
		const html = grenadeSkill();
		const elementID = this.elements.skillsContainer.id;
		document.getElementById(elementID).innerHTML = html;
	}

	renderOverlay() {
		const html = overlay();
		const elementID = this.elements.overlayContainer.id;
		document.getElementById(elementID).innerHTML = html;
	}

	startGame() {
		this.controller.defineZombieInvasion();
	}

	showСurtain() {
		const overlay = document.querySelector(SELECTOR_OVERLAY);
		const gameEndTable = document.querySelector(SELECTOR_GAME_END);
		gameEndTable.classList.add(CLASS_NAME_GAME_END_SHOW);
		overlay.classList.add(CLASS_NAME_OVERLAY_SHOW);
	}

	hideCurtain() {
		const overlay = document.querySelector(SELECTOR_OVERLAY);
		const gameEndTable = document.querySelector(SELECTOR_GAME_END);
		overlay.classList.remove(CLASS_NAME_OVERLAY_SHOW);
		gameEndTable.classList.remove(CLASS_NAME_GAME_END_SHOW);
	}

	removeListeners() {
		document.removeEventListener('keyup', this.controller.rightPlayerStep);
		document.removeEventListener('keyup', this.controller.leftPlayerStep);
		document.removeEventListener('keyup', this.controller.shootByTarget);
		document.removeEventListener('keyup', this.controller.throwGrenade);
	}

	unsubscribe() {
		this.pubSub.removeSubscribers('setElementsData', this.setElementsData);
		this.pubSub.removeSubscribers('stepPlayer', this.stepPlayer);
		this.pubSub.removeSubscribers('stepZombie', this.stepZombie);
		this.pubSub.removeSubscribers('shootByTarget', this.shootByTarget);
		this.pubSub.removeSubscribers('drawEndGame', this.drawEndGame);
		this.pubSub.removeSubscribers('moveGrenade', this.moveGrenade);
		this.pubSub.removeSubscribers('removeElement', this.removeElement);
		this.pubSub.removeSubscribers('removeZombieWithAnimation', this.removeZombieWithAnimation);
		this.pubSub.removeSubscribers('renderGameScores', this.renderGameScores);
		this.pubSub.removeSubscribers('drawZombieWave', this.drawZombieWave);
	}

	drawEndGame = () => {
		this.showСurtain();
		this.removeListeners();
		this.unsubscribe();
	}

	clearField() {
		document.querySelectorAll(SELECTOR_ZOMBIE).forEach(this.removeElement);
	}

	setPlayerDefaultPlace() {
		const playerColumn = document.getElementById(DEFAULT_PLAYER_PLACE_ID);
		playerColumn.append(this.playerElement);
	}

	redrawGame = () => {
		this.hideCurtain();
		this.setPlayerDefaultPlace();

		this.renderGameScores({
			levelValue: DEFAULT_LEVEL,
			pointsValue: DEFAULT_POINTS,
		});

		this.clearField();

		this.initSubscribers();
		this.initListeners();

		this.controller.refreshGameStatistics();
	}

	drawZombieWave = (columns) => {
		if (document.querySelector(SELECTOR_ZOMBIE)) {
			this.controller.stepZombie(document.querySelectorAll(SELECTOR_ZOMBIE));
		}

		setTimeout(() => {
			this.drawZombieInColumns(columns);
		}, DELAY_ANIMATION_DRAW_ZOMBIE);
	}

	addPlayerShot() {
		const shot = this.gameViewService.createPlayerShot();
		this.playerElement.append(shot);
	}

	createZombie() {
		const zombie = this.gameViewService.createDivElement(CLASS_NAME_ZOMBIE);
		zombie.style.top = DEFAULT_TOP;
		const hit = this.gameViewService.createHitByZombie();

		zombie.append(hit);

		return zombie;
	}

	stepZombie = (zombie, top) => {
		zombie.style.top = `${top}px`;
	}

	drawZombieInColumns(columns) {
		for (let columnNumber in columns) {
			const column = document.querySelectorAll(SELECTOR_FIELD_COLUMN)[columnNumber - 1];
			column.prepend(this.createZombie());
		}
	}

	stepPlayer = (pinterSibling) => {
		const playerColumn = this.playerElement.parentElement;
		const playerColumnSibling = playerColumn[pinterSibling];

		if (playerColumnSibling) {
			playerColumnSibling.append(this.playerElement);
		}
	}

	defineZombieColumnByPlayer() {
		const currentPlayerColumnID = this.playerElement.parentElement.id;

		return document.querySelectorAll(SELECTOR_FIELD_COLUMN)[currentPlayerColumnID - 1];
	}

	getZombieByShot() {
		const zombieColumn = this.defineZombieColumnByPlayer();
		const zombie = zombieColumn.querySelectorAll(SELECTOR_ZOMBIE);

		return zombie[zombie.length - 1];
	}

	shootByTarget = (data) => {
		const zombie = this.getZombieByShot();
		this.gameViewService.showPlayerShot();

		if (zombie) {
			this.gameSoundService.soundHitByZombie();
			this.removeZombieWithAnimation(zombie, this.gameViewService.showHitByTarget);
			this.renderGameScores(data);
		} else {
			this.controller.stepZombie(document.querySelectorAll(SELECTOR_ZOMBIE));
		}

		this.gameViewService.hidePlayerShotInDelay(DELAY_ANIMATION_HIDE_SHOT);
	}

	removeZombieWithAnimation = (zombie) => {
		this.gameViewService.showHitByTarget(zombie);

		setTimeout(() => {
			this.removeElement(zombie);
		}, DELAY_ANIMATION_REMOVE);
	}

	createGrenade() {
		const grenade = this.gameViewService.createDivElement(CLASS_NAME_GRENADE);
		grenade.style.bottom = DEFAULT_BOTTOM;

		return grenade;
	}

	throwGrenade = () => {
		const grenade = this.createGrenade();
		const zombie = this.getZombieByShot();
		const column = this.defineZombieColumnByPlayer();
		this.gameSoundService.bombExplosion();
		this.gameViewService.loader();

		column.append(grenade);

		const currentPlayerColumnID = this.playerElement.parentElement.id;
		this.controller.sendElements(grenade, zombie, currentPlayerColumnID);
	}

	moveGrenade = (grenade, bottom) => {
		grenade.style.bottom = `${bottom}px`;
	}

	removeElement(element) {
		element.remove();
	}
}
