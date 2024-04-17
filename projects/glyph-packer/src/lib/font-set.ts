import { parse as parseFont, Font } from 'opentype.js'

import font01 from '../assets/Roboto/Roboto-Black.ttf?url'
import font02 from '../assets/Roboto/Roboto-Medium.ttf?url'
import font03 from '../assets/Roboto/Roboto-Italic.ttf?url'
import font04 from '../assets/Roboto/Roboto-Regular.ttf?url'
import font05 from '../assets/Roboto/Roboto-Thin.ttf?url'

async function loadFont(url: string) {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    const font = parseFont(buffer)
    return font
}

async function loadFontSet(): Promise<Font[]> {
    const fontSet: Font[] = []
    fontSet.push(await loadFont(font01))
    fontSet.push(await loadFont(font02))
    fontSet.push(await loadFont(font03))
    fontSet.push(await loadFont(font04))
    fontSet.push(await loadFont(font05))
    return fontSet
}

export { loadFontSet }
