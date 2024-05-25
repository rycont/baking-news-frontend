import flatBreadSVG from '../../assets/flat-bread-label.svg?url'
import { globalStyle, style } from '@vanilla-extract/css'

export const wrapperStyle = style({
    backgroundImage: `url(${flatBreadSVG})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    height: '100vh',
    position: 'relative',
})

globalStyle(':root', {
    vars: {
        '--sh-container-background-color': 'var(--sh-color-l2)',
    },
})
