function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var GameController = function() {
};

GameController.prototype.init = function() {
	var self = this;
	this.scores = Cookies.get('scorelist');
	if(this.scores) {
		this.scores = JSON.parse(scores);
	} else {
		this.scores = [];
	}

	this.finalscreen = $("#final-screen");
	this.mainscreen = $("#main-screen");
	this.gamescreen = $("#game");

	this.scorecountf = $("#score");
	this.timecountf = $("#time");
	this.correctcountf = $("#correct");
	this.donecountf = $("#done");
	this.incorrectcountf = $("#incorrect");

	this.finalcountf = $("#final");
	this.hiscores = $("#hiscores");

	this.field1 = $("#field1");
	this.field2 = $("#field2");

	this.inp = $("#input");

	this.quitbtn = $("#quit");
	this.scoredgamebtn = $("#scored-game");
	this.infgamebtn = $("#inf-game");
	this.returnbtn = $("#return");

	this.inp.keypress(function(e) {
		if(e.keyCode === 13) {
			self.stepGame();
		}
	});

	this.quitbtn.click(function() {
		self.mainMenu();
	});

	this.returnbtn.click(function() {
		self.mainMenu();
	});

	this.scoredgamebtn.click(function() {
		self.initGame(20);
	});

	this.infgamebtn.click(function() {
		self.initGame(Infinity)
	})

	this.mainMenu();
}

GameController.prototype.initGame = function(timeout) {
	var self = this;
	this.finalscreen.hide();
	this.mainscreen.hide();
	this.gamescreen.show();

	this.timecount = timeout;

	this.updateGameFields();

	this.timeInterval = setInterval(function() {
		self.timecount -= 1;
		if(self.timecount === 0) {
			self.endGame(self.scorecount);
		} else {
			self.timecountf.html(self.timecount);
		}
	},1000);

	this.genProblem();
}

GameController.prototype.endGame = function(score) {
	clearInterval(self.timeInterval);

	this.finalscreen.show();
	this.mainscreen.hide();
	this.gamescreen.hide();

	this.scores.push(score);
	this.scores.sort();

	this.finalcountf.html(score);

	this.hiscores.html(this.scores.slice(0,5).map(function(sc, i) {
		return '<li class="list-group-item"><strong>'+i+'.</strong>'+sc+'</li>';
	}));

	Cookies.set("scorelist", JSON.stringify(this.scores));
}

GameController.prototype.mainMenu = function() {
	this.finalscreen.hide();
	this.mainscreen.show();
	this.gamescreen.hide();

	this.scorecount = 0;
	this.timecount = 0;
	this.correctcount = 0;
	this.donecount = 0;
	this.incorrectcount = 0;
}

GameController.prototype.genProblem = function() {
	var a = randInt(0,300);
	var b = randInt(1,10);
	var c = a%b;

	this.field1.html(a);
	this.field2.html(b);
	this.inp.val("");
	this.curSolution = c;

	this.inp.focus();
}

GameController.prototype.checkProblem = function() {
	return this.curSolution == this.inp.val();
}

GameController.prototype.updateGameFields = function() {
	this.scorecountf.html(this.scorecount);
	this.timecountf.html(this.timecount);
	this.correctcountf.html(this.correctcount);
	this.donecountf.html(this.donecount);
	this.incorrectcountf.html(this.incorrectcount);
}

GameController.prototype.stepGame = function() {
	this.donecount += 1;
	if(this.checkProblem()) {
		this.correctcount += 1;
		this.scorecount += 1;
	} else {
		this.incorrectcount += 1;
		this.scorecount -=1;
	}

	this.updateGameFields();

	this.genProblem();
}

$(document).ready(function() {
	(new GameController()).init();
});