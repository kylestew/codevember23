import { pickRandom } from './util/util.js'

const bgCols = [
    '#FFF5EE', //seashell
    '#fbf6e3', //canvas
    '#E6E0D4', //white coffee
    '#FDDEBD', //butter white
    '#F6FCFA', //white rose
    '#ECECEE', //christmas white
    '#1F201F', //retro black
    '#212122', //ink black
    '#1B1B1B', //eerie black
    '#242124', //raisin black
]

export function selectColors() {
    const bgc = pickRandom(bgCols)

    return {
        bgc,
        palette: bgCols,
    }
}
