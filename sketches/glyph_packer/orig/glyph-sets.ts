import { transduce, comp, flatten, mapcat, push, range } from '@thi.ng/transducers'

const alphaNumericCharacterSet = transduce(
    comp(
        flatten(),
        mapcat((char) => String.fromCharCode(char))
    ),
    push<string>(),
    // numbers, capital letters, lowercase letters
    [range(48, 57 + 1), range(65, 90 + 1), range(97, 122 + 1)]
)

export { alphaNumericCharacterSet }
