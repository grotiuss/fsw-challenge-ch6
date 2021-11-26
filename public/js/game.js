var refresh = document.getElementById('reset')
var versus = document.getElementById('versus')
var matchResult = document.getElementById('result')

function notEmpty() {
    refresh.children[0].style.width = '8em'
    console.log('Refresh button was clicked')
}

class Participant {
    constructor() {
        this.name = this.constructor.name
        this.selection = undefined
        this.tool = undefined
    }

    selected() {
        var tool = document.getElementById(this.selection)
        tool.style.backgroundColor = '#C4C4C4'
        tool.style.borderRadius = '25px'
    }

    reset() {
        var tool = document.getElementById(this.selection)
        refresh.children[0].style.width = '5em'
        if (tool) {
            tool.style.backgroundColor = ''
            tool.style.borderRadius = ''
        }
        this.selection = undefined
        this.tool = undefined
    }
}

class Player extends Participant {
    constructor() {
        super()
    }

    chooseRock() {
        if (!this.selection) {
            this.selection = 'r-player'
            this.tool = 'rock'
            this.selected()
            config()
        } else {
            notEmpty()
            console.log('Object is not empty')
        }
    }

    choosePaper() {
        if (!this.selection) {
            this.selection = 'p-player'
            this.tool = 'paper'
            this.selected()
            config()
        } else {
            notEmpty()
            console.log('Object is not empty')
        }
    }

    chooseScissor() {
        if (!this.selection) {
            this.selection = 's-player'
            this.tool = 'scissor'
            this.selected()
            config()
        } else {
            notEmpty()
            console.log('Object is not empty')
        }
    }
}

class Computer extends Participant {
    constructor() {
        super()
    }

    randomToolSelection() {
        const pil = Math.floor(Math.random() * 3);
        switch (pil) {
            case 0:
                this.tool = 'rock'
                this.selection = 'r-com'
                break
            case 1:
                this.tool = 'paper'
                this.selection = 'p-com'
                break
            case 2:
                this.tool = 'scissor'
                this.selection = 's-com'
                break
        }
    }
}

// var player = new Player()

var player = new Player()
var computer = new Computer()

function result() {
    var a = player.tool
    var b = computer.tool
    //choosing the winner
    if (a === 'rock') {
        if (b === 'rock') {
            var hasil = 'draw'
        } else if (b === 'paper') {
            var hasil = 'lose'
        } else {
            var hasil = 'win'
        }
    } else if (a === 'paper') {
        if (b === 'rock') {
            var hasil = 'win'
        } else if (b === 'paper') {
            var hasil = 'draw'
        } else {
            var hasil = 'lose'
        }
    } else {
        if (b === 'rock') {
            var hasil = 'lose'
        } else if (b === 'paper') {
            var hasil = 'win'
        } else {
            var hasil = 'draw'
        }
    }
    console.log(hasil)
    showingResult(hasil)
}

function showingResult(hasil) {
    if (hasil == 'win') {
        matchResult.children[0].innerHTML = 'PLAYER <br> WIN'
        matchResult.style.backgroundColor = '#4C9654'
        matchResult.style.paddingTop = ''
        matchResult.style.visibility = 'visible'
    } else if (hasil == 'lose') {
        matchResult.children[0].innerHTML = 'COMPUTER <br> WIN'
        matchResult.style.backgroundColor = '#4C9654'
        matchResult.style.paddingTop = ''
        matchResult.style.visibility = 'visible'
    } else {
        matchResult.children[0].innerHTML = 'DRAW'
        matchResult.style.backgroundColor = '#035B0C'
        matchResult.style.paddingTop = '1.5em'
        matchResult.style.visibility = 'visible'
    }
    versus.style.display = 'none'
}

function config() {
    console.log("Computer's turn")
    computer.randomToolSelection()
    computer.selected()
    result()

}

function reset() {
    player.reset()
    computer.reset()
    versus.style.display = ''
    matchResult.style.visibility = 'hidden'
}