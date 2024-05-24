import { keyframes, style } from '@vanilla-extract/css'

export const rendererStyle = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '4rem',
    lineHeight: '160%',
})

const opacityAppear = keyframes({
    from: {
        opacity: 0,
    },
    to: {
        opacity: 1,
    },
})

export const tokenAnimation = style({
    animation: `${opacityAppear} 1s ease forwards`,
})
