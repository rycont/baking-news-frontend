import { FOCUS_OUTLINE, shakeMiddle, vars } from '@shade/theme.css'
import { globalStyle, style } from '@vanilla-extract/css'

export const trashButton = style({
    border: 'none',
    padding: '3rem 0rem 3rem 3rem',
    margin: 0,
    alignSelf: 'stretch',
    background: 'transparent',
    borderRadius: '3rem',

    ...FOCUS_OUTLINE.default,
    ':focus': {
        ...FOCUS_OUTLINE.trigger,
        backgroundColor: vars.color.L2,
    },
})

globalStyle(`.${trashButton} svg`, {
    width: '5rem',
    height: '5rem',
    color: vars.color.L7,
})

globalStyle(`.${trashButton}:hover svg`, {
    animation: `${shakeMiddle} 1s infinite`,
    color: vars.color.L8,
})
