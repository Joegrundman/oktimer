export function parseTimer (transcript) {

    var parsed = transcript.split(' ').map(n => !isNaN(parseInt(n)) ? parseInt(n) : n)

    console.log(parsed)

    let time = 0
    parsed.forEach((t, i, arr) => {
        if(typeof t === 'number') {
            time = t
        } else {
            if( t === "seconds" || t === "second") {
                time *= 1000
            } else if ( t === "minutes" || t === "minute") {
                time*= 60000
            } else if ( t === "hours" || t === "hour" || t === "our" || t === "ours") {
                time *= 3600000
            }
        }
    })
    console.log('timer', time)
    return time
}
