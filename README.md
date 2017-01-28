##OK Timer

Voice activated timer app.

App made using react and native javascript voice api

Target use case: cooking

Usage:

voice _"OK Timer"_
response _"OK"_
voice _"take cake out"_
voice _"thirty minutes"_
voice _"OK"_
response _"take cake out thirty minutes"_
voice _"OK"_
response _"OK"_

voice _"OK Timer"_
response _"OK"_
voice _"take cake out"_
voice _"thirty minutes"_
voice _"OK"_
response _"take steak out forty minutes"_
voice _"no"_
voice _"take cake out"_
voice _"thirty minutes"_
response _"take cake out thirty minutes"_
voice _"OK"_
response _"OK"_

Displays each timer still active
When timer expires, app responds with message 
keeps responding every 10 seconds until dismissed with
"OK"
