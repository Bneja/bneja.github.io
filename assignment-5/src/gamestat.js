const gameStatC = {
    //need to make this component dynamic.
    props:['player1Score','player2Score','player1Flips','player2Flips','playerTurn'],
    template: /*html*/`
    <div id="gamestat">
        <div id="player1" v-bind:class="{'current-player':playerTurn===1}">
            <div>
                <p>
                    <span>Player 1:</span>&nbsp;<span class="score">{{player1Score}}</span>
                </p>
                <p>
                    <span>{{player1Flips}}&nbsp;flips</span>
                </p>
            </div>
        </div>
        <div id="player2" v-bind:class="{'current-player':playerTurn===2}">
            <div>
                <p>
                    <span>Player 2:</span>&nbsp;<span class="score">{{player2Score}}</span>
                </p>
                <p>
                    <span>{{player2Flips}}&nbsp;flips</span>
                </p>
            </div>
        </div>
    </div>`,
}