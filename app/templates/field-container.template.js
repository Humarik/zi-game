export const fieldContainer = () => `
	<div class="game-end">
		<h2 class="gameover-title">game over</h2>
		<div class="game-score">
			<div class="game-score__description ">
				<button class="restart-game">restart</button>
			</div>
		</div>
	</div>
	<div class="field">
		<div class="column"></div>
		<div class="column"></div>
		<div class="column"></div>
		<div class="column"></div>
		<div class="column"></div>
		<div class="column"></div>
		<div class="column"></div>
	</div>
	<div class="player-field">
		<div class="player-column" id="1"></div>
		<div class="player-column" id="2"></div>
		<div class="player-column" id="3"></div>
		<div class="player-column" id="4">
			<div class="player"></div>
		</div>
		<div class="player-column" id="5"></div>
		<div class="player-column" id="6"></div>
		<div class="player-column" id="7"></div>
	</div>`;
