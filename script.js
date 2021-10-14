const diceClasses = [
	'fas fa-dice-one fa-stack-1x',
	'fas fa-dice-two fa-stack-1x',
	'fas fa-dice-three fa-stack-1x',
	'fas fa-dice-four fa-stack-1x',
	'fas fa-dice-five fa-stack-1x',
	'fas fa-dice-six fa-stack-1x',
];

const totalsProbability = {
	2: 1 / 36,
	3: 2 / 36,
	4: 3 / 36,
	5: 4 / 36,
	6: 5 / 36,
	7: 6 / 36,
	8: 5 / 36,
	9: 4 / 36,
	10: 3 / 36,
	11: 2 / 36,
	12: 1 / 36,
};

const totalsHistory = {
	2: 0,
	3: 0,
	4: 0,
	5: 0,
	6: 0,
	7: 0,
	8: 0,
	9: 0,
	10: 0,
	11: 0,
	12: 0,
};

const colorProbability = {
	black: 3 / 6,
	blue: 1 / 6,
	green: 1 / 6,
	yellow: 1 / 6,
};

const colorHistory = {
	black: 0,
	blue: 0,
	green: 0,
	yellow: 0,
};

let barbPos = 1;

let numOfRolls = 0;

let cities = true;
//true = cities and knights is being played, show color die and barbarians pop-up
let robber = false;
//false = 7's cannot be rolled due to house rule, reroll all results. will toggle to true after the barbarians come the first time.

const colorDie = ['black', 'black', 'black', 'green', 'blue', 'yellow'];

const rollD6 = () => {
	return Math.ceil(Math.random() * 6);
};

const rollNumDie = (color) => {
	//roll the number and replace the die on the page with the appropriately numbered one.
	const roll = rollD6();
	$(`#${color}`)
		.removeClass()
		.addClass(`${diceClasses[roll - 1]}`);
	return roll;
};

const rollColorDie = () => {
	//roll the color and replace the color die on the page with the appropriately colored one.
	const color = colorDie[rollD6() - 1];
	$('#color').css('color', `${color}`);
	return color;
};

const rollDice = (citiesBool, robberBool) => {
	$('.barbarians').remove();

	let red = rollNumDie('red');
	let yellow = rollNumDie('yellow');
	let total = red + yellow;
	let color = '';
	//roll color die, check robber house rule
	if (citiesBool) {
		color = rollColorDie();
		if (!robberBool && total === 7) {
			while (total === 7) {
				red = rollNumDie('red');
				yellow = rollNumDie('yellow');
				total = red + yellow;
			}
		}
		//update barbarian tracker
		if (color === 'black') {
			$(`.tile${barbPos}`).css('background-color', 'rgb(221, 221, 221)');
			barbPos++;
			if (barbPos === 8) {
				robber = true; //if robber was false it will be set to true after the first time the barbarians come
				barbPos = 1;
				$('.dice-box').append(
					'<p class="barbarians">The barbarians strike!</p>'
				);
			}
			$(`.tile${barbPos}`).css('background-color', 'black');
		}
		colorHistory[color]++;
	}

	totalsHistory[total]++;

	numOfRolls++;
};

$('.roll').on('click', function (event) {
	//the main roll function from the "Roll Dice!" button
	event.preventDefault;
	rollDice(cities, robber);
});

$('input[name="cities"]').on('click', function (event) {
	//toggle for cities and knights, toggles the relevant sections to be hidden or not
	event.preventDefault;
	if ($('input[name="cities"]').is(':checked')) {
		$('.color, .barbarian-movement, table.colors, .robber').removeClass('hide');
		$('table.totals').css('grid-column', '1 / 2');
		cities = true;
	} else {
		$('.color, .barbarian-movement, table.colors, .robber').addClass('hide');
		$('table.totals').css('grid-column', '1 / 3');
		robber = true;
		cities = false;
	}
});

$('input[name="robber"]').on('click', function (event) {
	//toggle for robber house rule
	event.preventDefault;
	if ($('input[name="robber"]').is(':checked')) {
		robber = false;
	} else {
		robber = true;
	}
});

$('.view-button').on('click', function (event) {
	//switches page between the dice showing and the data showing
	event.preventDefault;
	$('.dice-box, .data-box, .view-button, .numRolls').toggleClass('hide');
	$('.added-rows').remove();
	$('.numRolls').text(`Rolls: ${numOfRolls}`);

	for (num in totalsHistory) {
		const roundedOdds = Math.round(totalsProbability[num] * numOfRolls);
		$('tbody.totals').append(
			`<tr class='added-rows'>
                <td>${num}</td>
			    <td>${totalsHistory[num]}</td>
                <td>${roundedOdds}</td>
                <td>${totalsHistory[num] - roundedOdds}</td>
            </tr>`
		);
	}

	for (color in colorHistory) {
		const roundedOdds = Math.round(colorProbability[color] * numOfRolls);
		$('tbody.colors').append(
			`<tr class='added-rows'>
                <td>${color}</td>
			    <td>${colorHistory[color]}</td>
                <td>${roundedOdds}</td>
                <td>${colorHistory[color] - roundedOdds}</td>
            </tr>`
		);
	}
});

$('.reset-button').on('click', function (event) {
	//resets all data from the game 
	event.preventDefault;
	$(`.tile${barbPos}`).css('background-color', 'rgb(221, 221, 221)');
	barbPos = 1;
	$(`.tile1`).css('background-color', 'black');
	numOfRolls = 0;
	for (num in totalsHistory) {
		totalsHistory[num] = 0;
	}
	for (color in colorHistory) {
		colorHistory[color] = 0;
	}
});
