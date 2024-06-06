import flatBreadSVG from '@assets/flat-bread-label.svg?url'
import { globalStyle, style } from '@vanilla-extract/css'

export const wrapperStyle = style({
    backgroundImage: `url(${flatBreadSVG})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    height: 'calc(100vh - env(safe-area-inset-bottom))',
    paddingTop: 'calc(env(safe-area-inset-top) + 12rem)',
    position: 'relative',
    overflowY: 'auto',
    boxSizing: 'border-box',
})

globalStyle(':root', {
    vars: {
        '--sh-container-background-color': 'var(--sh-color-l2)',
    },
})
