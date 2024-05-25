import flatBreadSVG from '../../assets/flat-bread-label.svg?url'
import { style } from '@vanilla-extract/css'

export const wrapperStyle = style({
    backgroundImage: `url(${flatBreadSVG})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    height: '100vh',
    position: 'relative',
    vars: {
        '--sh-container-background-color': 'var(--sh-color-l2)',
    },
})
