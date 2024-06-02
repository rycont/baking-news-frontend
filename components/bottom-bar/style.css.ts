import { globalStyle, style } from '@vanilla-extract/css'
import { THEME_COLOR, vars } from '@shade/theme.css'
import { NARROW_CONTAINER_WIDTH } from '@shade/elements/container-narrow/style.css'

export const appbarStyle = style({
    backgroundColor: vars.color.L2,
    borderTop: `0.5rem solid ${vars.color.L4}`,
    display: 'flex',
    position: 'fixed',
    maxWidth: `var(${NARROW_CONTAINER_WIDTH})`,
    width: '100%',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '4rem',
    boxSizing: 'border-box',
})

export const itemStyle = style({
    padding: '3rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: vars.color.L5,
    textDecoration: 'none',
    selectors: {
        '&[aria-current="page"]': {
            color: THEME_COLOR,
            backgroundColor: vars.color.L1,
            border: `1px solid ${vars.color.L4}`,
            borderRadius: '3rem',
        },
    },
})

export const itemIconWrapperStyle = style({
    height: '5rem',
})

globalStyle(`.${itemIconWrapperStyle} > svg`, {
    height: '5rem',
    width: 'fit-content',
})
