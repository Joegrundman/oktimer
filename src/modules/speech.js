export function parseTimer (transcript) {
    console.log(transcript)

    //split the transcript then map all number strings and strip s's off times
    // and remove irrelevant words
    // add s to times for plurals
    var parsed = transcript.split(' ')  
        .map(n => !isNaN(parseInt(n, 10)) ? parseInt(n, 10) : n)
        .map(n=> {
            if(typeof n === 'number') {
                return n
            } else if(typeof n === 'string'){
                switch(n) {
                    case 'one': return 1;
                    case 'two': return 2;
                    case 'three': return 3;
                    case 'four': return 4;
                    case 'five': return 5;
                    case 'six': return 6;
                    case 'seven': return 7;
                    case 'eight': return 8;
                    case 'nine': return 9;
                    case 'ten': return 10;
                    case 'second': return 'second';
                    case 'seconds': return 'second';
                    case 'minute': return 'minute';
                    case 'minutes': return 'minute';
                    case 'hour': return 'hour';
                    case 'hours': return 'hour';
                    case 'our': return 'hour';
                    case 'ours': return 'hour';
                    default: return ''
                }
            }
            // shouldn't ever get this far, just to make react tools problem disappear
            return n
        })
        .filter(n => n !== '')
        .map((n, i, arr) => {
            if(typeof n === 'number') return n
            if(typeof n === 'string'){
                if(typeof arr[i - 1] === 'number' && arr[i - 1] !== 1){
                    return n + 's'
                } else{
                    return n
                }
            }
            return n
        })

    let time = 0
    let tmp = 0
    parsed.forEach(t => {
        if(typeof t === 'number') {
            tmp = t
        } else {

            if( t === "seconds" || 
                t === "second") {
                tmp *= 1000
            } else if ( t === "minutes" || 
                        t === "minute") {
                tmp*= 60000
            } else if ( t === "hours" ||
                        t === "hour" ) {
                tmp *= 3600000
            }
            time += tmp
            tmp = 0
        }
    })
    
    console.log('timer', time)
    return [time, parsed.filter(n => n!== '').join(' ')]
}

export function speak (text, voice, callback) {
    const msg = new SpeechSynthesisUtterance ()
    const synth = window.speechSynthesis
    msg.text = text
    if(voice) { msg.voice = window.speechSynthesis.getVoices().find(v => v.name === voice)}
    synth.speak(msg)

    msg.onend = (e) => {
        if(callback) { 
            console.log('finish speaking')
            callback()
        }
    }
}

export function parseMilliseconds(milliseconds) {
    var seconds = Math.round(milliseconds / 1000)
    var hours = Math.floor(seconds / 3600)
    seconds %= 3600
    var minutes = Math.floor(seconds / 60)
    seconds %= 60

    return `${hours > 0 ? hours + ':' : ''}
            ${minutes < 10 ? '0' + minutes : minutes}:
            ${seconds < 10 ? '0' + seconds: seconds}`
}

export function getTranscript(e){
    return Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
}

 