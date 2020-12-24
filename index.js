import { View } from './app/app.view.js';
import { Model } from './app/app.model.js';
import { Controller } from './app/app.controller.js';
import { PubSub } from './app/publish-subscribers.js';
import { Helper } from './app/app.helper.js';
import { GameViewService } from './app/game-view.service.js';
import { GameSoundService } from './app/game-sound.service.js';

const appHelper = new Helper();
const gameViewService = new GameViewService();
const gameSoundService = new GameSoundService();

const pubSub = new PubSub();
const model = new Model(pubSub, appHelper);
const controller = new Controller(model, appHelper);
const view = new View(controller, pubSub, gameViewService, gameSoundService);

view.startGame();
