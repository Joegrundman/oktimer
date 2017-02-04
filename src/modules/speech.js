export function parseTimer (transcript) {

    var parsed = transcript.split(' ')  
        .map(n => !isNaN(parseInt(n, 10)) ? parseInt(n, 10) : n)

    console.log(parsed)

    let time = 0
    let tmp = 0
    parsed.forEach((t, i, arr) => {
        if(typeof t === 'number') {
            tmp = t
        } else if (t === 'one') {
            tmp = 1
        } else if (t === 'two') {
            tmp = 2
        } else if (t === 'three') {
            tmp = 3
        } else if (t === 'four') {
            tmp = 4
        } else if (t === 'five') {
            tmp = 5
        } else {

            if( t === "seconds" || 
                t === "second") {
                tmp *= 1000
            } else if ( t === "minutes" || 
                        t === "minute") {
                tmp*= 60000
            } else if ( t === "hours" ||
                        t === "hour" || 
                        t === "our" || 
                        t === "ours") {
                tmp *= 3600000
            }
            time += tmp
            tmp = 0
        }
    })
    console.log('timer', time)
    return time
}

export function speak (text, voice, callback) {
    const msg = new SpeechSynthesisUtterance ()
    const synth = window.speechSynthesis
    console.log('current voice', voice)
    msg.text = text
    if(voice) { msg.voice = window.speechSynthesis.getVoices().find(v => v.name === voice)}
    synth.speak(msg)

    msg.onend = (e) => {
        console.log('ENDED with elapsed time', e.elapsedTime)
        
        if(callback) { 
            console.log('finish speaking')
            callback()
        }
    }
}


