function Character(name, race, life, damage){
    this.name = name;
    this.race = race;
    this.life = life;
    this.damage = damage;
    this.maxLife = life;
    this.counter = 2;
    this.secretDrink = false;
    this.enchanted = false;
}

Character.STANDARTLIFE = 1000;
Character.STANDARTDAMAGE = 50;

Character.prototype.setLife = function(dmg) {
    this.life -= dmg;
}

Character.prototype.updateCharacter = function() {
    this.life = this.maxLife;
    this.enchanted = false;
    this.counter = 2;
}

Character.prototype.getDamage = function() {
    return this.damage;
}

Character.prototype.attack = function(obj) {
    obj.setLife(this.getDamage());
}

Character.prototype.isAlive = function() {
    return this.life > 0;
}

Character.prototype.getLife = function() {
    return this.life;
}

Character.prototype.shouldUseSkill = function() {
    return (this.life < this.maxLife/2 && this.counter > 0);
}

Character.prototype.shouldUseSecretDrink = function(opposite) {
    return this.secretDrink && ((this instanceof Hero && opposite instanceof Monster ) || (this instanceof Monster && opposite instanceof Hero))
}

Character.prototype.drinkSecretDrink = function () {
    console.log("Character " + this.name + " use secret drink");
    this.secretDrink = false;
    this.enchanted = true;
    this.counter *= 2;
}

Character.prototype.prepareForBattle = function(opposite) {
    if(this.shouldUseSecretDrink(opposite)) {
        this.drinkSecretDrink();
    }
}

Character.prototype.setReward = function () {
    this.secretDrink = true;
}

function Hero () {
    Character.apply(this, arguments);
}

Hero.THEIF = {
    race: 'theif',
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

Hero.prototype.setLife = function(dmg) {
    if ( this.shouldUseSkill() ) {
        console.log(this.name + ' use hero skill');
        this.counter--;
    } else {
        this.life -= dmg;
    }
}

Hero.prototype.getDamage = function () {
    if(this.enchanted){
        return Monster.prototype.getDamage.call(this);
    } else {
        return Character.prototype.getDamage.call(this);
    }
}

function Monster () {
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


Monster.prototype.getDamage = function() {
    if ( this.shouldUseSkill() ) {
        console.log(this.name + ' use monster skill');
        this.counter--;
        return this.damage*2;
    }
    return this.damage;
}

Monster.prototype.setLife = function (dmg) {
    if(this.enchanted){
        return Hero.prototype.setLife.call(this, dmg);
    } else {
        return Character.prototype.setLife.call(this, dmg);
    }
}

var CharacterFactory = function () {}

CharacterFactory.createHero = function (name, race) {
    return new Hero(name, race, Character.STANDARTLIFE, Character.STANDARTDAMAGE);
}

CharacterFactory.createMonster = function (name, race) {
    return new Monster(name, race, Character.STANDARTLIFE, Character.STANDARTDAMAGE);
}

CharacterFactory.createHeroTheif = function (name) {
    return new Hero(name, Hero.THEIF.race, Hero.THEIF.life, Hero.THEIF.damage);
}

CharacterFactory.createHeroWizard = function (name) {
    return new Hero(name, Hero.WIZARD.race, Hero.WIZARD.life, Hero.WIZARD.damage);
}

CharacterFactory.createHeroWarrior = function (name) {
    return new Hero(name, Hero.WARRIOR.race, Hero.WARRIOR.life, Hero.WARRIOR.damage);
}

CharacterFactory.createMonsterGoblin = function(name) {
    return new Monster(name, Monster.GOBLIN.race, Monster.GOBLIN.life, Monster.GOBLIN.damage)
}

CharacterFactory.createMonsterOrk = function(name) {
    return new Monster(name, Monster.ORK.race, Monster.ORK.life, Monster.ORK.damage)
}

CharacterFactory.createMonsterVampire = function(name) {
    return new Monster(name, Monster.VAMPIRE.race, Monster.VAMPIRE.life, Monster.VAMPIRE.damage)
}

function Game(character1, character2) {
    this.character1 = character1;
    this.character2 = character2;
    this.loser;
    this.winner;
    this.noWinners = false;
}

Game.prototype.getCharacter1 = function() {
    return this.character1;
}
Game.prototype.getCharacter2 = function() {
    return this.character2;
}

Game.prototype.setLoser = function(character) {
    this.loser = character
}
Game.prototype.setWinner = function(character) {
    this.winner = character
}
Game.prototype.getLoser = function() {
    return this.loser;
}
Game.prototype.getWinner = function() {
    return this.winner;
}
Game.prototype.isDraw = function() {
    return this.noWinners;
}

Game.prototype.fight = function (charcter1, character2) {
    while (charcter1.isAlive() && character2.isAlive()) {
        charcter1.attack(character2);
        console.log(this.character2.name + ' life: ' + character2.getLife());
        character2.attack(charcter1);
        console.log(this.character1.name + ' life: ' + charcter1.getLife());
    }
    if(charcter1.isAlive()) {
        this.setWinner(charcter1);
        this.setLoser(character2);
    } else if (character2.isAlive()) {
        this.setWinner(character2);
        this.setLoser(charcter1)
    } else {
        this.noWinners = true;
    }
}


var Herold = function () {
}

Herold.prototype.declare = function (message) {
    console.log(message);
}

var listOfAllowedHeroNames = {
    "theif": ["Diamond", "Ruby", "Emerald"],
    "wizard": ["Thunder", "Ice", "Fire"],
    "warrior": ["Courage", "Wisdom", "Power"]
}

var monstersAndCreaturesGuide = {
    "ork": ["RedHorror", "DarkTerror", "NightFear"],
    "goblin": ["Destroyer", "Demolisher", "Breaker"],
    "vampire": ["Nightmare", "Dracula", "Bloody"]
}

var FaceControl = function () {

}

FaceControl.prototype.checkOrigin = function (character) {
    if (character instanceof Hero || character instanceof Monster) {
        return true;
    }
    return false;
}

FaceControl.prototype.checkRace = function(character) {
    if (character instanceof Hero) {
        for(var key in Hero){
            if(Hero[key].race == character.race) {
                return true;
            }
        }
    } else if (character instanceof Monster && (character.race === Monster.ORK.race || character.race === Monster.GOBLIN.race || character.race === Monster.VAMPIRE.race )){
        for(var key in Monster){
            if(Monster[key].race == character.race) {
                return true;
            }
        }
    }
    return false;

}

FaceControl.prototype.checkName = function(character) {
    if (character instanceof Hero){
        return listOfAllowedHeroNames[character.race].indexOf(character.name) >= 0;
    } else if (character instanceof Monster){
        return monstersAndCreaturesGuide[character.race].indexOf(character.name) >= 0;
    }
}

FaceControl.prototype.pass = function(character){
    if(this.checkOrigin(character) &&  this.checkRace(character) && this.checkName(character)) {
       return true;
    }
    return false;
}

var Tournament = function (number) {
    this.number = number;
    this.participants = [];
    this.herold = new Herold();
    this.faceControl = new FaceControl();
    this.winner;
}

Tournament.prototype.getParticipans = function() {
    return this.participants;
}
    Tournament.prototype.getNumber = function() {
    return this.number;
}

Tournament.prototype.getRandomCharacter = function() {
    var minPosition = 1;
    var maxPosition = this.getParticipans().length
    var rand = minPosition + Math.random() * (maxPosition- minPosition);
    rand = Math.floor(rand);
    return this.getParticipans()[rand];
}

Tournament.prototype.subscribe = function(character) {
    this.participants.push(character);
}

Tournament.prototype.unsubscribe = function(character) {
    this.participants.splice(this.participants.indexOf(character), 1)
}

Tournament.prototype.registrate = function(character) {
    if(this.getParticipans().length == this.getNumber()) {
        this.herold.declare("There no more places!" )
    } else {
        if (this.faceControl.pass(character)) {
            this.herold.declare("Character " + character.name + " admitted to the tournament!" )
            this.subscribe(character);
        } else {
            this.herold.declare("Character " + character.name + " didn't pass facecontrol!" )
        }
    }
}

Tournament.prototype.start = function() {
    if(this.getParticipans().length) {
        while (this.getParticipans().length > 1) {
            var character1 = this.getParticipans()[0];
            var character2 = this.getRandomCharacter();

            this.herold.declare("Figters are " + character1.name + " and " + character2.name);

            character1.prepareForBattle(character2);
            character2.prepareForBattle(character1);

            var myGame = new Game(character1, character2);
            myGame.fight(myGame.getCharacter1(), myGame.getCharacter2());

            if(myGame.isDraw()) {
                this.herold.declare("There are no winners");
                this.unsubscribe(character1);
                this.unsubscribe(character2);
            } else {
                var winner = myGame.getWinner();
                var loser = myGame.getLoser();
                this.herold.declare("Winner is " + winner.name);
                winner.updateCharacter();
                winner.setReward();
                this.unsubscribe(loser);
            }
        }
        if(this.getParticipans().length > 0) {
            this.winner = this.getParticipans()[0];
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
// var monster2 = CharacterFactory.createMonsterGoblin("Destroyer");
var monster3 = CharacterFactory.createMonsterVampire("Dracula");

var hero1 = CharacterFactory.createHeroTheif("Ruby");
var defectHero = CharacterFactory.createHeroTheif("Jack");
var hero2 = CharacterFactory.createHeroWarrior("Wisdom");
var hero3 = CharacterFactory.createHeroWizard("Ice");

tournament.registrate(monster1);
tournament.registrate(defectMonster);
// tournament.registrate(monster2);
tournament.registrate(monster3);
tournament.registrate(hero1);
tournament.registrate(defectHero);
tournament.registrate(hero2);
tournament.registrate(hero3);

tournament.start();