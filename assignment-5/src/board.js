const imageLetters = ["A", "B", "C", "D", "E","F","G","H","I","J","K","L","M","N","O","P"];

class Card{
    constructor(img){
        this.img_id = img;  
        this.img = "images/" + img + ".gif";
        this.flipped=false;
        this.removed=false;
    }
}

function mixedCards(){
    let imageLettersMixed=mix(imageLetters).slice(0,8);
    let cards = [];
    for (let i = 0; i< imageLettersMixed.length; i++){
        cards.push(new Card(imageLettersMixed[i]));
        cards.push(new Card(imageLettersMixed[i]));
    }
    cards=mix(cards);
    return cards;
}
function mix(arr){
    for (let i = 0; i<arr.length; i++){
        let randomIndex=Math.floor(Math.random()*(arr.length));
        let temp=arr[i];
        arr[i]=arr[randomIndex];
        arr[randomIndex]=temp;
    }
    return arr;
}
const boardC = {
    props:['gameEnded'],
    template: /*html*/`
    <div class="cardboard">
        <div class="outer" v-for="card in cards" v-bind:class="{flipped:card.flipped, removed:card.removed}" v-on:click="tryFlip(card);">
            <div class="card front">
                <img v-bind:src="card.img">
            </div>
            <div class="card back"></div>
        </div>
    </div>
    `,
    data: function() {
        // need logic here fore flipping cards, 
        // finding matched cards,
        // removing cards if they are matched,
        // flip them back if they are not matching.
        return {
            cards: mixedCards(),
            flippedCardCount: 0,
            flippedCard: NaN
        };
    },
    methods:{
        tryFlip:function(card){
            if (this.flippedCardCount===0){
                this.flippedCardCount++;
                card.flipped=true;
                this.flippedCard=card;
                this.$emit('flipped-card');
            }else if (this.flippedCardCount===1&&!card.flipped){
                this.flippedCardCount++;
                card.flipped=true;
                this.$emit('flipped-card');
                if (this.flippedCard.img_id===card.img_id){
                    setTimeout(()=>{
                        card.removed=true;
                        this.flippedCard.removed=true;
                        this.flippedCardCount=0;
                        this.$emit('match');
                        this.$emit('next-turn');
                    }, 1000)
                } else{
                    setTimeout(()=>{
                        this.flippedCard.flipped=false;
                        card.flipped=false;
                        this.flippedCardCount=0;
                        this.$emit('next-turn');
                    },1000)
                }
            }
        }
    },
    watch:{
        gameEnded:function(){
            this.cards = mixedCards();
            this.flippedCardCount = 0;
            this.flippedCard = NaN;
        }
    }
}