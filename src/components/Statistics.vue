<template>
    <div id="container"
        class="container">
        <div class="windowHeader">
            <div>               
            </div>
            <div class="heavyFont">
                STATISTICS
            </div>
            <div>
                <button @click="$emit('closeStatisticsWindow')" class="close-button"></button>
            </div>
        </div>
        <div class="statisticsCounts">
            <div class="statisticsCount">
                <div class="number">
                    {{ gamesPlayed }}
                </div>
                <div class="note">
                    Played
                </div>
            </div>
            <div class="statisticsCount">
                <div class="number">
                    {{ winPercent() }}
                </div>
                <div class="note">
                    Win %
                </div>
            </div>    
        </div>
        <div class="heavyFont">
            GUESS DISTRIBUTION
        </div>
        <div v-for="(number, i) in winDistribution" :key="i" class="rows">
            <div class = "rowNumber">
                {{ i + 1 }}
            </div>
            <button 
                :class="['winLine',
                    guessToHighlight === i + 1 ? 'highlight' : '']"
                :style="{ width: rowLength(number) + 'px' }"> {{ number }}</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Statistics extends Vue {

    @Prop() public gamesPlayed!: number
    @Prop() public gamesWin!: number
    @Prop() public winDistribution!: number[]
    @Prop() public guessToHighlight!: number

    mounted() {
        document.addEventListener('mouseup', e => this.handleMouseUp(e))
    }

    public handleMouseUp(e: MouseEvent){
        
        const node = document.getElementById('container')
        if (!node?.contains(e.target as Node)) {    
            this.$emit('closeStatisticsWindow')
        }
    }

    public winPercent(): number {

        if (this.gamesPlayed === 0) {
            return 0
        }

        return Math.round(this.gamesWin / this.gamesPlayed * 100)
    }

    public rowLength(answerCount: number): number {
        
        const maxRowLen = 130
        const minRowLen = 20  

        let maxCountInArray = 0
        let rowLen = 0

        if (answerCount === 0) {
            return minRowLen
        }

        for (let i=0; i<=5; i++) {
            if (this.winDistribution[i] > maxCountInArray) {
                maxCountInArray = this.winDistribution[i]
            }
        }

        if (answerCount === maxCountInArray) {
            rowLen = maxRowLen
        }
        else {
            rowLen = Math.round(answerCount / maxCountInArray * maxRowLen)
        }    
        
        return rowLen + minRowLen
    }
}

</script>
  
<style lang = "scss" scoped>
 
@import "../style.scss";

.rows {
    display: flex;
    align-items: left;
    margin-bottom: 2px;
    margin-left: 32%;
}

.winLine {
    background-color: $colorGray100;
    border-radius: 0%;
    border: none;
    text-align: left;
    font-weight: bold;
    font-size: 12px;
    color: $colorWhite; 
}

.highlight {
    background-color: $colorGreen
}

.rowNumber {
    font-size: 12px;
    font-weight: bold;
    margin-right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.statisticsCounts {
    display: flex;
    justify-content: center;
}

.statisticsCount {
    display: block;
    margin-right: 10px;
    margin-bottom: 20px;
}

.number {
    font-size: 36px;
    font-weight: 400;
}

.note {
    font-size: 12px;
}
</style>