export function parseTimer (transcript) {

    var parsed = transcript.split(' ').map(n => !isNaN(parseInt(n, 10)) ? parseInt(n, 10) : n)

    console.log(parsed)

    let time = 0
    let tmp = 0
    parsed.forEach((t, i, arr) => {
        if(typeof t === 'number') {
            tmp = t
        } else if (t === 'five') {
            tmp = 5
        } else if (t === 'two') {
            tmp = 2
        } else if (t === 'one') {
            tmp = 1
        } else {
            if( t === "seconds" || t === "second") {
                tmp *= 1000
            } else if ( t === "minutes" || t === "minute") {
                tmp*= 60000
            } else if ( t === "hours" || t === "hour" || t === "our" || t === "ours") {
                tmp *= 3600000
            }
            time += tmp
            tmp = 0
        }
    })
    console.log('timer', time)
    return time
}

export function speak (text, callback) {
    const msg = new SpeechSynthesisUtterance ()
    const synth = window.speechSynthesis
    msg.text = text
    synth.speak(msg)

    msg.onend = (e) => {
        console.log('ENDED with elapsed time', e.elapsedTime)
        
        if(typeof callback === 'function') { 
            callback()
        }
    }
}
