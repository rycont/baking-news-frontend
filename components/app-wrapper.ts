import { ShadeContainerNarrow } from '../shade-ui/elements/container-narrow'
import flatBreadSVG from '/image/flat-bread.svg?url'
import { DefineOnce } from '../shade-ui/util'

console.log(flatBreadSVG)

export class AppWrapper extends ShadeContainerNarrow {
    constructor() {
        super()
    }

    connectedCallback() {
        super.connectedCallback()

        this.style.setProperty('background-image', `url(${flatBreadSVG})`)
        this.style.setProperty('background-repeat', 'no-repeat')
        this.style.setProperty('background-position', 'center')
    }
}

DefineOnce.define('app-wrapper', AppWrapper)
