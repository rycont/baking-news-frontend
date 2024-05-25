import { style } from '@vanilla-extract/css'
import { vars } from '../../shade-ui/theme.css'
import { NARROW_CONTAINER_WIDTH } from '../../shade-ui/elements/container-narrow/style.css'

export const appbarStyle = style({
    backgroundColor: vars.color.L2,
    borderTop: `0.5rem solid ${vars.color.L4}`,
    display: 'flex',
    position: 'fixed',
    width: `var(${NARROW_CONTAINER_WIDTH})`,
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
})

export const itemIconWrapperStyle = style({
    height: '5rem',
    '> svg': {
        height: '5rem',
        width: 'fit-content',
    },
})
