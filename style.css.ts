import { keyframes, style } from '@vanilla-extract/css'

export const glowingText = keyframes({
    '0%': {
        backgroundPosition: '25% 50%',
    },
    '100%': {
        backgroundPosition: '125% 50%',
    },
})

export const logTextStyle = style({
    color: 'linear-gradient(270deg, #000000, #ffffff, #000000, #ffffff, #000000)',
    animation: `${glowingText} 2s linear infinite`,
})
