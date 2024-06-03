import { globalStyle } from '@vanilla-extract/css'

globalStyle('provider-list', {
    overflowY: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
    marginTop: '-3rem',
    flex: 1,
})

globalStyle('provider-list > [data-filly]', {
    flex: 1,
})
