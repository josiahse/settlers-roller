const diceClasses = [
	'fas fa-dice-one',
	'fas fa-dice-two',
	'fas fa-dice-three',
	'fas fa-dice-four',
	'fas fa-dice-five',
	'fas fa-dice-six',
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

const rollDice = (citiesBool, robberBool) => {
	// console.log(robber)
    $('.barbarians').remove();

	const diceRoll = {
		red: 0,
		yellow: 0,
		total: 0,
		color: null,
	};

	diceRoll.red = rollD6();
	$('.red')
		.find('>:first-child')
		.removeClass()
		.addClass(`${diceClasses[diceRoll.red - 1]}`);
	diceRoll.yellow = rollD6();
	$('.yellow')
		.find('>:first-child')
		.removeClass()
		.addClass(`${diceClasses[diceRoll.yellow - 1]}`);
	diceRoll.total = diceRoll.red + diceRoll.yellow;
	
    if (citiesBool) {
		diceRoll.color = colorDie[rollD6() - 1];
		$('.color').find('>:first-child').css('color', `${diceRoll.color}`);
		if (!robberBool && diceRoll.total === 7) {
			while (diceRoll.total === 7) {
				diceRoll.red = rollD6();
				diceRoll.yellow = rollD6();
				diceRoll.total = diceRoll.red + diceRoll.yellow;
			}
		}
	}

    if (diceRoll.color === 'black') {
        $(`.tile${barbPos}`).css('background-color', 'rgb(221, 221, 221)');
        barbPos++;
        if (barbPos === 8){
            robber = true;
            barbPos = 1;
            $('.dice-box').append('<p class="barbarians">The barbarians strike!</p>');
        }
        $(`.tile${barbPos}`).css('background-color', 'black');
    }

	totalsHistory[diceRoll.total]++;
	colorHistory[diceRoll.color]++;
	
    numOfRolls++;
};

$('.roll').on('click', function (event) {
	event.preventDefault;
	rollDice(cities, robber);
});

$('input[name="cities"]').on('click', function (event) {
	event.preventDefault;
	if ($('input[name="cities"]').is(':checked')) {
		$('.color, .barbarian-movement').removeClass('hide');
		cities = true;
	} else {
		$('.color, .barbarian-movement').addClass('hide');
		robber = true;
		cities = false;
	}
});

$('input[name="robber"]').on('click', function (event) {
	event.preventDefault;
	if ($('input[name="robber"]').is(':checked')) {
		robber = false;
	} else {
		robber = true;
	}
});

$('.view-button').on('click', function (event) {
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
                <td'>${color}</td>
			    <td'>${colorHistory[color]}</td>
                <td'>${roundedOdds}</td>
                <td'>${colorHistory[color] - roundedOdds}</td>
            </tr>`
		);
	}
});

$('.reset-button').on('click', function(event) {
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

// for (let i = 0; i < 100; i++){
//     console.log(robber)
//     rollDice(cities, robber);
// }