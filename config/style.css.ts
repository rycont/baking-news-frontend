import { style } from '@vanilla-extract/css'

export default {
    providerList: style({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 2fr))',
        gap: '2rem',
    }),
}
