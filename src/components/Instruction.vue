<template>
    <div class="container" id="container">
        <div class="windowHeader">
            <div>               
            </div>
            <div class="heavyFont">
                HOW TO PLAY
            </div>
            <div>
                <button @click="$emit('closeInstructionsWindow')" class="close-button"></button>
            </div>
        </div>
        <div class="rule">
            Guess the hidden word in 6 tries.
        </div>
        <div class="rule">
            Each guess must be a valid 5-letter word.
        </div>
        <div class="rule ruleBottom">
            The color of the tiles will change to show how close your guess was to the word.
        </div>
        <div class="example"> 
            Examples
        </div>
        <table class="table">       
            <tbody>
                <td v-for="(letter, j) in exampleWords[0]" :key="j">
                    <div
                        :class="['letter', 'squareInstructionSize',
                            'letter' + letter.type, 
                            j === 0 ? 'flipCurrentLetter' : '']"> 
                        {{ letter.value }}
                    </div>
                </td>
            </tbody>
        </table>
        <div class="rule">
            <strong>W</strong>
            &nbsp;is in the word and in the correct spot.
        </div>
        <table class="table">       
            <tbody>
                <td v-for="(letter, j) in exampleWords[1]" :key="j">
                    <div
                        :class="['letter', 'squareInstructionSize',
                            'letter' + letter.type,
                            j === 1 ? 'flipCurrentLetter' : '']"> 
                        {{ letter.value }}
                    </div>
                </td>
            </tbody>
        </table>
        <div class="rule">
            <strong>I</strong>
            &nbsp;is in the word but in the wrong spot.
        </div>
        <table class="table">       
            <tbody>
                <td v-for="(letter, j) in exampleWords[2]" :key="j">
                    <div
                        :class="['letter', 'squareInstructionSize',
                            'letter' + letter.type, 
                            j === 3 ? 'flipCurrentLetter' : '']"> 
                        {{ letter.value }}
                    </div>
                </td>
            </tbody>
        </table>
        <div class="rule ruleBottom" >
            <strong>U</strong>
            &nbsp;is not in the word in any spot.
        </div>                        
    </div>
</template>
  
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { letterState, getExampleWords } from '@/letter-info'; 

@Component
export default class Instruction extends Vue {

    public exampleWords = getExampleWords()

    created() {
        setTimeout(() => {
            this.exampleWords[0][0].type = letterState.green            
            this.exampleWords[1][1].type = letterState.yellow            
            this.exampleWords[2][3].type = letterState.gray            
        }, 500);

        document.addEventListener('mouseup', e => this.handleMouseUp(e))
    }

    public handleMouseUp(e: MouseEvent){
        
        const node = document.getElementById('container')
        if (!node?.contains(e.target as Node)) {    
            this.$emit('closeInstructionsWindow')
        }
    }
}

</script>
  
<style lang="scss" scoped>
 
@import "../style.scss";
 
.rule {
    display: flex;
    font-size: 14px;
    text-align: left;
    margin-bottom: 0.5rem;
    color: black;
}
.ruleBottom {
    border-bottom: 1px solid $colorGray300; 
    height: 50px;
}
.table {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    transform: translateX(-3px);
}
.example {
    display: flex;
    font-size: 14px;
    text-align: left;
    font-weight: 600;
    margin-bottom: 1rem;
    margin-top: 1rem;
}

</style>