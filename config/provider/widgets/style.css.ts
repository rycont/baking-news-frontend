import { style } from '@vanilla-extract/css'

export const providerTextWrapperStyle = style({
    overflow: 'hidden',
})

export const providerUrlStyle = style({
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
})
