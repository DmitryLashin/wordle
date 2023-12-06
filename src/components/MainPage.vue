<template>
    <div>
        <Transition name="floating-text">
            <span v-if="showError" class="message">{{ errorMessage }}</span>        
        </Transition>
        <header class="header">
            <div>
                <button @click="showStatistics=false; showInstruction=true"
                    class="instruction-button">
                </button>
            </div>            
            <div class="title">
                WORDLE
            </div>
            <div>
                <button @click="showInstruction=false; showStatistics=true"
                    class="statistics-button"></button>
            </div>          
        </header>
        <table class="lettersGrid">       
            <tbody>
                <tr v-for="(row, i) in lettersGrid" :key="i" :class="{shakeCurrentRow: showError && i === currentWord}">
                    <td v-for="(letter, j) in lettersGrid[i]" :key="j">
                        <div
                            :class="['letter', 'letter' + letter.type,
                                scaleCurrentLetter(letter, i, j) ? 'scaleCurrentLetter' : '',
                                letterNumberToFlip === j && i === currentWord - 1 
                                    || playOpenAnimation && i <= currentWord - 1 ? 'flipCurrentLetter' : '',
                                    playBounceAnimation && i === currentWord - 1 ? 'bounceLetter' : '']"
                            :style="{'animation-delay': bounceAnimationDelay(j) + 'ms'}"
                            > 
                            <div>
                                {{ letter.value }}
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <Transition name="floating-text">
            <span v-if="showEndGameMessage" class="end-game-message">{{ endGameMessage }}</span>        
        </Transition>
        <table class="keyboardGrid">       
            <tbody>
                <tr v-for="(row, i) in keyboardGrid" :key="i" class="keyboardGrid">
                    <td v-for="(letter, j) in keyboardGrid[i]" :key="j" class="keyboardItem">
                        <span @click="letterInput(letter.value)"
                            :class="['letterKeyboard',
                                'letterKeyboard' + letter.type,
                                letter.value.length > 1 ? 'controlButton' : '',
                                letter.value === keyPressed ? 'letterKeyboardPressed' : '']"> 
                            {{ letter.value }} 
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <Transition name = "appear-window">
            <Instruction                  
                @closeInstructionsWindow="showInstruction=false"
                v-if="showInstruction"
                class="slide-window"/>
            <Statistics
                :gamesPlayed=gamesPlayed
                :gamesWin=gamesWin
                :winDistribution=winDistribution
                :guessToHighlight=guessToHighlight
                @closeStatisticsWindow="showStatistics=false"
                v-if="showStatistics"
                class="slide-window"/>                  
        </Transition>  
    </div>
</template>
  
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { letterState, letter, getLettersGrid, getKeyboardGrid } from '@/letter-info';
import { wordInList, getWordToAskBySequence } from '@/wordsList'; 
import Instruction from './Instruction.vue'
import Statistics  from './Statistics.vue';

@Component({
components: {
    Instruction,
    Statistics
  },
})

export default class MainPage extends Vue {

    public gamesPlayed = 0;
    public gamesWin = 0;
    public gameDate = '';
    public winDistribution = [0, 0, 0, 0, 0, 0]

    public currentLetter = 0
    public currentWord = 0
    public lettersGrid: letter[][] = []
    public keyboardGrid: letter[][] = []
    public wordToAsk = ''
    public gameState = gameState.progress

    public keyPressed = ''

    public showError = false
    public showEndGameMessage = false
    public errorMessage = ''
    public endGameMessage = ''
    public winMessage = ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew']
    public showInstruction = false  
    public showStatistics = false
    public guessToHighlight = 0;
    public playBounceAnimation = false;
    
    public letterNumberToFlip = -1
    public states = new Map<string, letterState>() 
    public playOpenAnimation = false 

    mounted() {
        const gamesPlayed = localStorage.getItem('gamesPlayed')

        if (gamesPlayed) {
            this.gamesPlayed = +gamesPlayed
        }

        const gamesWin = localStorage.getItem('gamesWin')

        if (gamesWin) {
            this.gamesWin = +gamesWin
        }

        const gameDate = localStorage.getItem('gameDate')
        const today = new Date()
        const currentDayString = today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString()

        const winDistribution = localStorage.getItem('winDistrubution')

        if (winDistribution) {
            this.winDistribution = JSON.parse(winDistribution)
        }

        if (gameDate !== currentDayString) {
            this.startTheGame()
        }
        else {
            const keyboardGrid = localStorage.getItem('keyboardGrid')

            if (keyboardGrid) {
                this.keyboardGrid = JSON.parse(keyboardGrid)
            }

            const lettersGrid = localStorage.getItem('lettersGrid')

            if (lettersGrid) {
                this.lettersGrid = JSON.parse(lettersGrid)
            }

            const currentLetter = localStorage.getItem('currentLetter')

            if (currentLetter) {
                this.currentLetter = +currentLetter
            }

            const currentWord = localStorage.getItem('currentWord')

            if (currentWord) {
                this.currentWord = +currentWord
            }

            const wordToAsk = localStorage.getItem('wordToAsk')

            if (wordToAsk) {
                this.wordToAsk = wordToAsk
            }

            const gameState = localStorage.getItem('gameState')

            if (gameState) {
                this.gameState = JSON.parse(gameState)
            }

            this.playOpenAnimation = true
            setTimeout(()=>{this.playOpenAnimation = false}, 500)
        }

        localStorage.setItem('gameDate', currentDayString)
    }

    created() {
        document.addEventListener('keydown', e => this.letterInput(e.key))
    }
    
    public bounceAnimationDelay(letterNumber: number): number {
        if (this.playBounceAnimation) {    
            return letterNumber * 100
        }
        
        return 0
    }

    public startTheGame() {
        this.currentLetter = 0
        this.currentWord = 0
        this.lettersGrid = getLettersGrid()
        this.keyboardGrid = getKeyboardGrid()
        this.wordToAsk = getWordToAskBySequence()
        this.gameState = gameState.progress
        this.endGameMessage = this.wordToAsk

        localStorage.setItem('currentLetter', this.currentLetter.toString())
        localStorage.setItem('currentWord', this.currentWord.toString())
        localStorage.setItem('lettersGrid', JSON.stringify(this.lettersGrid))
        localStorage.setItem('keyboardGrid', JSON.stringify(this.keyboardGrid))
        localStorage.setItem('wordToAsk', this.wordToAsk)
        localStorage.setItem('gameState', JSON.stringify(this.gameState))        
    }

    public scaleCurrentLetter (letter: letter, rowNumber: number, letterNumber: number): boolean {
        return letter.value !== '' 
            && letterNumber === this.currentLetter - 1 
            && rowNumber === this.currentWord 
            && this.keyPressed != 'BACK.' 
            && this.keyPressed != '' 
            && this.keyPressed != 'ENTER'
    }

    public showBounceAnimation (rowNumber: number): boolean {
        return this.gameState === gameState.win 
            && rowNumber === this.currentWord - 1
            && this.guessToHighlight !== 0
    }    

    public letterInput(input: string): void {

        if (this.gameState !== gameState.progress) {
            return        
        }
                
        input = input.toLocaleUpperCase()

        if (input === 'BACKSPACE') {
            input = 'BACK.'  
        }

        this.keyPressed = input
        setTimeout(() => {this.keyPressed = ''}, 100);

        if (input === 'BACK.') {
            if (this.currentLetter > 0) {
                this.currentLetter --
            }

            this.lettersGrid[this.currentWord][this.currentLetter].value = ''
            this.lettersGrid[this.currentWord][this.currentLetter].type = letterState.blank
        }
        else if (input === 'ENTER') {
            
            let wordToSpellCheck = this.getWordToCheck(this.currentWord)
            
            if (wordToSpellCheck.length < 5) {
                this.showErrorMessage('Not enough letters')
            }
            else if (!wordInList(wordToSpellCheck)) {
                this.showErrorMessage('Not in word list')  
            }
            else {
                this.setLetterNumberToFlip()     
                
                if (this.currentWord === 0) {
                    this.gamesPlayed++
                    localStorage.setItem('gamesPlayed', this.gamesPlayed.toString());
                }
                
                this.currentWord++
                this.currentLetter = 0    
                
                localStorage.setItem('currentWord', this.currentWord.toString());
                localStorage.setItem('currentLetter', this.currentLetter.toString());
            }

        }
        else if (/[A-Z]/.test(input) && this.currentLetter < 5 && input.length === 1) {
            this.lettersGrid[this.currentWord][this.currentLetter].value = input
            this.lettersGrid[this.currentWord][this.currentLetter].type = letterState.filled
            this.currentLetter++
        }
    }
    
    public handleGameEnd() {

        if (this.wordToAsk === this.getWordToCheck(this.currentWord-1)) {
            this.endGameMessage = this.winMessage[this.currentWord-1]
            this.gameState = gameState.win
            this.playBounceAnimation = true

            this.winDistribution[this.currentWord - 1]++
            localStorage.setItem('winDistrubution', JSON.stringify(this.winDistribution))
            this.gamesWin++
            localStorage.setItem('gamesWin', (this.gamesWin).toString())
        }
        else if (this.currentWord-1 >= 5) {
            this.endGameMessage = this.wordToAsk.toLocaleUpperCase()
            this.gameState = gameState.loss
        }

        localStorage.setItem('gameState', JSON.stringify(this.gameState))
    }

    public showErrorMessage(errorMessage: string) {
        this.showError = true
        this.errorMessage = errorMessage

        setTimeout(() => {
            this.showError = false
            this.errorMessage = ''
        }, 900)          
    }

    public getWordToCheck(row: number): string {
        return  (this.lettersGrid[row][0].value +
            this.lettersGrid[row][1].value +
            this.lettersGrid[row][2].value +
            this.lettersGrid[row][3].value +
            this.lettersGrid[row][4].value).toLocaleLowerCase()
    }

    public setLetterNumberToFlip() {
        if (this.letterNumberToFlip >= 5) {
            this.letterNumberToFlip = -1
            return
        }

        this.letterNumberToFlip++
        setTimeout(() => {this.setLetterNumberToFlip()}, 500)
    }

    @Watch("letterNumberToFlip") 
    letterNumberToFlipOnChange(): void {

        // Change letter state
        if (this.letterNumberToFlip >= 1) {
            let letter = this.lettersGrid[this.currentWord - 1][this.letterNumberToFlip - 1].value;
            let index = this.wordToAsk.indexOf(letter.toLocaleLowerCase())
            let state = letterState.gray

            if (letter.toLocaleLowerCase() === this.wordToAsk[this.letterNumberToFlip - 1]) {
                state = letterState.green
            }
            else if (index >= 0) {
                state = letterState.yellow
            }
            
            this.lettersGrid[this.currentWord - 1][this.letterNumberToFlip - 1].type = state    
            
            if (this.states.get(letter) !== letterState.green) {
                this.states.set(letter, state)
            }
        }
        
        // If flip animation is over
        if (this.letterNumberToFlip >= 5) {
            // Change keyboard state
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= this.keyboardGrid[i].length - 1; j++) {
                    let state = this.states.get(this.keyboardGrid[i][j].value)
                    if (state) {
                        this.keyboardGrid[i][j].type = state    
                    }    
                }
            }
            
            localStorage.setItem('keyboardGrid', JSON.stringify(this.keyboardGrid))
            localStorage.setItem('lettersGrid', JSON.stringify(this.lettersGrid))

            this.states.clear()
            this.handleGameEnd()

            // Show endgame message
            if (this.gameState !== gameState.progress) {
                this.showEndGameMessage = true
            
                setTimeout(() => {
                    this.showEndGameMessage = false

                    if (this.gameState === gameState.win) {
                        this.guessToHighlight = this.currentWord
                    }

                    this.showStatistics = true
                }, 3000)   
            
            }            
        }       
    }    
}

enum gameState {
    progress,
    win,
    loss
}

</script>
  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

@import "../style.scss";

.title {
    text-align: center;
    font-family: $font;   
    font-weight: 700;  
    font-size: 27px; 
    letter-spacing: 0.2rem;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $colorGray300;
    height: 50px;
}

.instruction-button {
    cursor: pointer;
    background: none;
    border: none;
    background-image: url('../assets/sign.png');  
    height: 20px; 
    width: 20px; 
    background-size: cover;
    margin-top: 5px;    
}

.statistics-button {
    cursor: pointer;
    background: none;
    border: none;
    background-image: url('../assets/statistics.png');  
    height: 20px; 
    width: 20px; 
    background-size: cover;
    margin-top: 5px;
}

.lettersGrid {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 40px;
    margin-bottom: 40px;
}

.keyboardGrid {
    display: flex;
    align-items: center;
    justify-content: center;
}

.keyboardItem {
    margin: 2px
}

.letterKeyboardGray {
    background-color: $colorGray100;
    color: $colorWhite
}

.letterKeyboardYellow {
    background-color: $colorYellow;
    color: $colorWhite;
}

.letterKeyboardGreen {
    background-color: $colorGreen;
    color: $colorWhite;
}

.letterKeyboard {
    width: 30px;
    height: 50px;
    display:flex;
    border-radius: 5px;
    cursor:default;    
    font-weight: bold;
    align-items: center;
    justify-content: center;
    font-family: $font;     
    &:hover{
        background-color: $colorGray400;
        color:rgb(61, 63, 66);
    }       
}  
   
.letterKeyboardFilled {
    background-color: #e6e4e4;
}

.letterKeyboardPressed {
    background-color: $colorGray400;
}  

.controlButton {
    width: 40px;
    font-size: 10px;
}   

.message {
    font-family: $font; 
    background-color: #333333; 
    color: $colorWhite;
    font-size: 12px; 
    font-weight: 400; 
    text-transform: none;
    border-radius: 3px; 
    padding: 10px;
    transform: translateX(-50%);
    position: absolute;
    top: 70px;
    z-index: 1;
}

.end-game-message {
    font-family: $font; 
    background-color: #333333; 
    color: $colorWhite;
    font-size: 12px; 
    font-weight: 400; 
    text-transform: none;
    border-radius: 3px; 
    padding: 10px;
    transform: translateX(-50%);
    position: absolute;
    top: 455px;
    z-index: 1;
}

.slide-window {
    position: absolute;
    transform: translateX(-12%);
    z-index: 1;
    top: 70px
}

.scaleCurrentLetter {
    animation: scaleCurrentLetter 0.1s ease;
}

@keyframes scaleCurrentLetter {
    0% {
        scale: 0.9;
    }

    50% {
        scale: 1.1;
    }

    100% {
        scale: 1;
    }
}

.bounceLetter {
    animation: bounceLetter 1s forwards;
}

@keyframes bounceLetter {
    10% {
        transform: translateY(2px);
    }

    50% {
        transform: translateY(-4px);
    }

    90% {
        transform: translateY(1px);
    }

    100% {
        transform: translateY(0px);
    } 
}

.shakeCurrentRow {
    animation: shakeCurrentRow 0.9s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
}

@keyframes shakeCurrentRow {
    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}

.floating-text-enter-active,
.floating-text-leave-active {
    transition: opacity 0.45s ease;
}

.floating-text-enter,
.floating-text-leave-to {
    opacity: 0;
}

.appear-window-enter-active,
.appear-window-leave-active {
    transition: all 0.5s ease; 
}
.appear-window-enter-to
.appear-window-leave{
    opacity: 1;
}
.appear-window-enter {
    opacity: 0;
    transform: translateX(-30%);
}
.appear-window-leave-to {
    opacity: 0;
    transform: translateX(30%);
}

</style>
  