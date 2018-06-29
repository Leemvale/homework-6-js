//Зелье дается за победу в бою, персонаж может использовать зелье 1 раз за бой, после боя действие зелья прекращается.

function Character(name, race, life, damage) {
    this.name = name;
    this.race = race;
    this.life = life;
    this.damage = damage;
    this.maxLife = life;
    this.counter = 2;
    this.StealTheSkillPotion = null;
}

Character.STANDARTLIFE = 1000;
Character.STANDARTDAMAGE = 50;

Character.prototype.setLife = function (dmg) {
    this.life -= dmg;
}

Character.prototype.updateCharacter = function () {
    this.life = this.maxLife;
    if (this.StealTheSkillPotion !== null && this.StealTheSkillPotion.use) {
        this.StealTheSkillPotion.cancelTheEnchantment(this);
        this.StealTheSkillPotion = null;
    }
}

Character.prototype.getDamage = function () {
    return this.damage;
}

Character.prototype.attack = function (obj) {
    obj.setLife(this.getDamage());
}

Character.prototype.isAlive = function () {
    return this.life > 0;
}

Character.prototype.getLife = function () {
    return this.life;
}

Character.prototype.shouldUseSkill = function () {
    return (this.life < this.maxLife / 2);
}

Character.prototype.drinkSecretDrink = function (opposite) {
    console.log("Character " + this.name + " use secret drink");
    this.StealTheSkillPotion.enchantTheCharacter(this, opposite);
}

Character.prototype.prepareForFight = function (opposite) {
    if (this.shouldUseSecretDrink(opposite)) {
        this.drinkSecretDrink(opposite);
    }
}

Character.prototype.setReward = function () {
    this.StealTheSkillPotion = new StealTheSkillPotion();
}


function Hero() {
    Character.apply(this, arguments);
}

Hero.THIEF = {
    race: 'thief',
    life: 1500,
    damage: Character.STANDARTDAMAGE
}
Hero.WARRIOR = {
    race: 'warrior',
    life: 1250,
    damage: 75
}
Hero.WIZARD = {
    race: 'wizard',
    life: Character.STANDARTLIFE,
    damage: 100
}

Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.setLife = function (dmg) {
    var counter = this.counter;
    var self = this;

    this.setLife = function (dmg) {
        if (self.shouldUseSkill() && counter) {
            console.log(self.name + ' use hero skill');
            counter--;
        } else {
            self.life -= dmg;
        }
    }

    this.setLife(dmg);
}

Hero.prototype.shouldUseSecretDrink = function (opposite) {
    return this.StealTheSkillPotion && opposite instanceof Monster;
}

Hero.prototype.updateCharacter = function () {
    this.setLife = Hero.prototype.setLife;
    Character.prototype.updateCharacter.apply(this);
}


function Monster() {
    Character.apply(this, arguments);
}

Monster.GOBLIN = {
    race: 'goblin',
    life: Character.STANDARTLIFE,
    damage: 100
}
Monster.ORK = {
    race: 'ork',
    life: 1250,
    damage: 75
}
Monster.VAMPIRE = {
    race: 'vampire',
    life: 1500,
    damage: Character.STANDARTDAMAGE
}

Monster.prototype = Object.create(Character.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.getDamage = function () {
    var counter = this.counter;
    var self = this;

    this.getDamage = function () {
        if (self.shouldUseSkill() && counter) {
            console.log(self.name + ' use monster skill');
            counter--;
            return self.damage * 2;
        }
        return self.damage;
    }
    return this.getDamage();
}

Monster.prototype.shouldUseSecretDrink = function (opposite) {
    return this.StealTheSkillPotion && opposite instanceof Hero;
}

Monster.prototype.updateCharacter = function () {
    this.getDamage = Monster.prototype.getDamage;
    Character.prototype.updateCharacter.apply(this);
}


function Potion() {
    this.isUsed = false;
}


function StealTheSkillPotion() {
    Potion.apply(this);
}

StealTheSkillPotion.prototype = Object.create(Potion.prototype);
StealTheSkillPotion.constructor = StealTheSkillPotion;

StealTheSkillPotion.prototype.enchantTheCharacter = function (character, opposite) {
    if (!this.isUsed) {
        if (character instanceof Hero && opposite instanceof Monster) {
            character.getDamage = Monster.prototype.getDamage;
        } else if (character instanceof Monster && opposite instanceof Hero) {
            character.setLife = Hero.prototype.setLife;
        }
        this.isUsed = true;
    }
}

StealTheSkillPotion.prototype.cancelTheEnchantment = function (character) {
    if (character instanceof Hero) {
        character.getDamage = Character.prototype.getDamage;
    } else if (character instanceof Monster) {
        character.setLife = Character.prototype.setLife;
    }
}


function CharacterFactory() {
}

CharacterFactory.createHero = function (name, race) {
    return new Hero(name, race, Character.STANDARTLIFE, Character.STANDARTDAMAGE);
}

CharacterFactory.createMonster = function (name, race) {
    return new Monster(name, race, Character.STANDARTLIFE, Character.STANDARTDAMAGE);
}

CharacterFactory.createHeroThief = function (name) {
    return new Hero(name, Hero.THIEF.race, Hero.THIEF.life, Hero.THIEF.damage);
}

CharacterFactory.createHeroWizard = function (name) {
    return new Hero(name, Hero.WIZARD.race, Hero.WIZARD.life, Hero.WIZARD.damage);
}

CharacterFactory.createHeroWarrior = function (name) {
    return new Hero(name, Hero.WARRIOR.race, Hero.WARRIOR.life, Hero.WARRIOR.damage);
}

CharacterFactory.createMonsterGoblin = function (name) {
    return new Monster(name, Monster.GOBLIN.race, Monster.GOBLIN.life, Monster.GOBLIN.damage)
}

CharacterFactory.createMonsterOrk = function (name) {
    return new Monster(name, Monster.ORK.race, Monster.ORK.life, Monster.ORK.damage)
}

CharacterFactory.createMonsterVampire = function (name) {
    return new Monster(name, Monster.VAMPIRE.race, Monster.VAMPIRE.life, Monster.VAMPIRE.damage)
}


function Game(character1, character2) {
    this.character1 = character1;
    this.character2 = character2;
    this.loser = null;
    this.winner = null;
}

Game.prototype.getCharacter1 = function () {
    return this.character1;
}

Game.prototype.getCharacter2 = function () {
    return this.character2;
}

Game.prototype.setWinnerAndLoser = function (winner, loser) {
    this.winner = winner;
    this.loser = loser;
}

Game.prototype.getLoser = function () {
    return this.loser;
}

Game.prototype.getWinner = function () {
    return this.winner;
}

Game.prototype.isDraw = function () {
    return this.getWinner() === null;
}

Game.prototype.fight = function (character1, character2) {
    character1.prepareForFight(character2);
    character2.prepareForFight(character1);
    while (character1.isAlive() && character2.isAlive()) {
        character1.attack(character2);
        console.log(this.character2.name + ' life: ' + character2.getLife());
        character2.attack(character1);
        console.log(this.character1.name + ' life: ' + character1.getLife());
    }
    this.sumUpTheFight(character1, character2);
}

Game.prototype.sumUpTheFight = function (character1, character2) {
    if (character1.isAlive()) {
        this.setWinnerAndLoser(character1, character2);
        character1.updateCharacter();
    } else if (character2.isAlive()) {
        this.setWinnerAndLoser(character2, character1);
        character2.updateCharacter();
    }
}


function Herold() {
}

Herold.prototype.declare = function (message) {
    console.log(message);
}


var listOfAllowedHeroNames = {
    "thief": ["Diamond", "Ruby", "Emerald"],
    "wizard": ["Thunder", "Ice", "Fire"],
    "warrior": ["Courage", "Wisdom", "Power"]
}

var monstersAndCreaturesGuide = {
    "ork": ["RedHorror", "DarkTerror", "NightFear"],
    "goblin": ["Destroyer", "Demolisher", "Breaker"],
    "vampire": ["Nightmare", "Dracula", "Bloody"]
}


function FaceControl() {
}

FaceControl.prototype.checkOrigin = function (character) {
    return character instanceof Hero || character instanceof Monster
}

FaceControl.prototype.checkRace = function (character) {
    if (character instanceof Hero) {
        for (var key in Hero) {
            if (Hero[key].race === character.race) {
                return true;
            }
        }
    } else if (character instanceof Monster) {
        for (var key in Monster) {
            if (Monster[key].race === character.race) {
                return true;
            }
        }
    }
    return false;
}

FaceControl.prototype.checkName = function (character) {
    if (character instanceof Hero) {
        return listOfAllowedHeroNames[character.race].indexOf(character.name) >= 0;
    } else if (character instanceof Monster) {
        return monstersAndCreaturesGuide[character.race].indexOf(character.name) >= 0;
    }
}

FaceControl.prototype.pass = function (character) {
    return this.checkOrigin(character) && this.checkRace(character) && this.checkName(character)
}


function Tournament(number) {
    this.number = number;
    this.participants = [];
    this.herold = new Herold();
    this.faceControl = new FaceControl();
    this.winner = null;
}

Tournament.prototype.getParticipants = function () {
    return this.participants;
}

Tournament.prototype.setParticipants = function (participants) {
    this.participants = participants;
}

Tournament.prototype.getNumber = function () {
    return this.number;
}

Tournament.prototype.addParticipant = function (character) {
    this.participants.push(character);
}

Tournament.prototype.registrate = function (character) {
    if (this.getParticipants().length === this.getNumber()) {
        this.herold.declare("There no more places!")
    } else {
        if (this.faceControl.pass(character)) {
            this.herold.declare("Character " + character.name + " admitted to the tournament!");
            this.addParticipant(character);
        } else {
            this.herold.declare("Character " + character.name + " didn't pass facecontrol!")
        }
    }
}

Tournament.prototype.makeCurrentOppositesList = function () {
    var oppositesList = [];
    var participants = this.getParticipants();
    var middle = Math.round(participants.length / 2);
    for (var i = 0; i < middle; i++) {
        oppositesList.push([participants[i], participants[middle + i]]);
    }
    return oppositesList;
}

Tournament.prototype.playRound = function () {
    var roundWinners = [];
    var opposites = this.makeCurrentOppositesList();
    while (opposites.length) {
        var character1 = opposites[0][0];
        var character2 = opposites[0][1];

        if (character2 === undefined) {
            roundWinners.push(character1);
        } else {
            this.herold.declare("Fighters are " + character1.name + " and " + character2.name);

            var myGame = new Game(character1, character2);
            myGame.fight(myGame.getCharacter1(), myGame.getCharacter2());

            if (!myGame.isDraw()) {
                myGame.getWinner().setReward();
                roundWinners.push(myGame.getWinner());
            }
        }
        opposites.shift();
    }
    console.log("roundWinners ", roundWinners)
    this.setParticipants(roundWinners);
}

Tournament.prototype.start = function () {
    if (this.getParticipants().length) {
        while (this.getParticipants().length > 1) {
            this.playRound();
        }
        if (this.getParticipants().length) {
            this.winner = this.getParticipants()[0];
            this.herold.declare("Tournament winner is " + this.winner.name);
        } else {
            this.herold.declare("There are no winners in tournament!")
        }

    } else {
        this.herold.declare("There are no participants!");
    }
}

var tournament = new Tournament(6);

var monster1 = CharacterFactory.createMonsterOrk("RedHorror");
var defectMonster = CharacterFactory.createMonster("Terror", "Zombie");
var monster2 = CharacterFactory.createMonsterGoblin("Destroyer");
var monster3 = CharacterFactory.createMonsterVampire("Dracula");

var hero1 = CharacterFactory.createHeroThief("Ruby");
var defectHero = CharacterFactory.createHeroThief("Jack");
var hero2 = CharacterFactory.createHeroWarrior("Wisdom");
var hero3 = CharacterFactory.createHeroWizard("Ice");

tournament.registrate(monster1);
tournament.registrate(defectMonster);
tournament.registrate(monster2);
tournament.registrate(monster3);
tournament.registrate(hero1);
tournament.registrate(defectHero);
tournament.registrate(hero2);
tournament.registrate(hero3);

tournament.start();