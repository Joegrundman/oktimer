##OK Timer

Voice activated timer app.

App made using react and native javascript voice api

Target use case: cooking

Usage:

voice "OK Timer"
response "OK"
voice "take cake out"
voice "thirty minutes"
voice "OK"
response "take cake out thirty minutes"
voice "OK"
response "OK"

voice "OK Timer"
response "OK"
voice "take cake out"
voice "thirty minutes"
voice "OK"
response "take steak out forty minutes"
voice "no"
voice "take cake out"
voice "thirty minutes"
response "take cake out thirty minutes"
voice "OK"
response "OK"

Displays each timer still active
When timer expires, app responds with message 
keeps responding every 10 seconds until dismissed with
"OK"
