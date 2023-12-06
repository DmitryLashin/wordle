export const enum letterState {
    blank = 'Blank',
    filled = 'Filled',
    gray = 'Gray',
    yellow = 'Yellow',
    green = 'Green'
}

export type letter = {
    value: string
    type: letterState
}

function getLettersGrid(): letter[][] {
    const grid: letter[][] = []
    let row: letter[] = []

    for (let i = 1; i <= 6; i++) {
        for (let j = 1; j <= 5; j++) {
            const letterToAdd: letter = {
                value: '',
                type: letterState.blank
            }
            row.push(letterToAdd)
        }

        grid.push(row)
        row = []
    }

    return grid
}

function getKeyboardGrid(): letter[][] {
    const grid: letter[][] = []
    let row: letter[] = []

    const keys: string[][] = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", ""],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK.", ""]
    ];

    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 9; j++) {
            if (keys[i][j] !== '') {
                const letterToAdd: letter = {
                    value: keys[i][j],
                    type: letterState.filled
                }
                row.push(letterToAdd)
            }    
        }

        grid.push(row)
        row = []
    }

    return grid
}

function getExampleWords(): letter[][] {
    const words: letter[][] = []

    const firstExample = [
        {value: 'W', type: letterState.filled},
        {value: 'E', type: letterState.filled},
        {value: 'A', type: letterState.filled},
        {value: 'R', type: letterState.filled},
        {value: 'Y', type: letterState.filled}
    ]

    const secondExample = [
        {value: 'P', type: letterState.filled},
        {value: 'I', type: letterState.filled},
        {value: 'L', type: letterState.filled},
        {value: 'L', type: letterState.filled},
        {value: 'S', type: letterState.filled}
    ]

    const thirdExample = [
        {value: 'V', type: letterState.filled},
        {value: 'A', type: letterState.filled},
        {value: 'G', type: letterState.filled},
        {value: 'U', type: letterState.filled},
        {value: 'E', type: letterState.filled}
    ]

    words.push(firstExample, secondExample, thirdExample)

    return words
}

export {
    getLettersGrid,
    getKeyboardGrid,
    getExampleWords
}