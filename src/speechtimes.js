export function isTimer (transcript) {
    switch (transcript) {
        case "zero":
        case "one":
        case "two":
        case "three":
        case "four":
        case "five":
        case "six":
        case "seven":
        case "eight":
        case "nine":
        case "ten":
        case "eleven":
        case "twelve":
        case "thirteen":
        case "fourteen":
        case "fifteen":
        case "sixteen":
        case "seventeen":
        case "eighteen":
        case "nineteen":
        case "twenty":
        case "thirty":
        case "fourty":
        case "fifty":
        case "sixty":
        case "seventy":
        case "eighty":
        case "ninety":
        case " a hundred": return true
        default: return false
    }
}

const mapper = x => {
    switch(x){
        case "zero": return 0
        case "one": return 1
        case "two": return 2
        case "three": return 3
        case "four": return 4
        case "five": return 5
        case "six": return 6
        case "seven": return 7
        case "eight": return 8
        case "nine": return 9
        case "ten": return 10
        case "eleven": return 11
        case "twelve": return 12
        case "thirteen": return 13
        case "fourteen": return 14
        case "fifteen": return 15
        case "sixteen": return 16
        case "seventeen": return 17
        case "eighteen": return 18
        case "nineteen": return 19
        case "twenty": return 20
        case "thirty": return 30
        case "fourty": return 40
        case "fifty": return 50
        case "sixty": return 60
        case "seventy": return 70
        case "eighty": return 80
        case "ninety": return 90
        case "a":  return 1
        case "hundred": return 100
        case "thousand": return 1000
        default: return x
    }
}

export function parseTimer (transcript) {
    const parsed = transcript.split(' ').map(mapper)
    let timer = 0
    parsed.forEach((t, i, arr) => {
        // start with simple single digit cases
        if (typeof t === Number) {
            timer = t
        } else {
            if( t === ("seconds" || "seconds")) {
                t *= 1000
            } else if ( t === ("minutes" || "minute")) {
                t = t * 1000 * 60
            } else if ( t === ("hours" || "hour" || "our" || "ours")) {
                t = t * 1000 * 60 * 60
            }
        }
    })
    return timer

}