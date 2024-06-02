import { vars } from '@shade/theme.css'
import { globalStyle, style } from '@vanilla-extract/css'

export const providerListItemStyle = style({
    padding: '3rem 4rem',
    backgroundColor: vars.color.L2,
    border: '1px solid ' + vars.color.L3,
    borderRadius: '2rem',
})

globalStyle('#providers', {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 2fr))',
    gap: '2rem',
})
