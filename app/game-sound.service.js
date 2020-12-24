import {
	AUDIO_PLAYBACK_RATE_HIT_BY_ZOMBIE,
	AUDIO_VOLUME_HIT_BY_ZOMBIE,
	AUDIO_VOLUME_BOMB_EXPLOSION,
	AUDIO_PLAYBACK_BOMB_EXPLOSION,
} from './app.constants.js';

export class GameSoundService {
	soundHitByZombie() {
		const audio = new Audio('./sounds/damage.mp3');
		audio.volume = AUDIO_VOLUME_HIT_BY_ZOMBIE;
		audio.playbackRate = AUDIO_PLAYBACK_RATE_HIT_BY_ZOMBIE;
		audio.play();
	}

	bombExplosion() {
		const audio = new Audio('./sounds/shindeiruEffect.mp3');
		audio.volume = AUDIO_VOLUME_BOMB_EXPLOSION;
		audio.playbackRate = AUDIO_PLAYBACK_BOMB_EXPLOSION;
		audio.play();
	}
}
