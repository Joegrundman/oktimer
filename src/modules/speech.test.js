import { speak, parseTimer } from './speech'

it('should convert a string of numbers and time units into a time in milliseconds', () => {
    expect(parseTimer('3 seconds')).toEqual(3000)
    expect(parseTimer('3 minutes')).toEqual(3000 * 60)
    expect(parseTimer('3 hours')).toEqual(3000 * 60 * 60)
    expect(parseTimer('2 minutes 30 seconds')).toEqual((2000 * 60) + 30000)
    expect(parseTimer('five minutes')).toEqual(1000 * 60 * 5)
    expect(parseTimer('two minutes')).toEqual(1000 * 60 * 2)
})

