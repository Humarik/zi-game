export const gameScoresTemplate = ({
	 levelTitle,
	 levelValue,
	 pointsTitle,
	 pointsValue,
}) => `<div class="game-score">
	<div class="game-score__description"
		><span class="game-score__level"
			><span class="game-score__level-title">${levelTitle}</span
			><span class="game-score__level-value">${levelValue}</span
		></span
		><span class="game-score__current-points"
			><span class="game-score__current-points-title">${pointsTitle}</span
			><span class="game-score__current-points-value">${pointsValue}</span
		></span
	></div>
</div>`;
