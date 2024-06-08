import { vars } from '@shade/theme.css'
import { style } from '@vanilla-extract/css'

export default {
    info: style({
        padding: '3rem 4rem',
        backgroundColor: vars.color.L2,
        border: '1px solid ' + vars.color.L3,
        borderRadius: '2rem',
        color: vars.color.L9,
    }),
}
