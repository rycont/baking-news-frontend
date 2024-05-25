import { ShadeContainerNarrow } from '../../shade-ui/elements/container-narrow'
import { DefineOnce } from '../../shade-ui/util'
import { APP_BAR, AppBar } from '../appbar'
import { wrapperStyle } from './style.css'

export class AppWrapper extends ShadeContainerNarrow {
    static observedAttributes = ['appbar']
    private _appBar: AppBar | null = null

    constructor() {
        super()
    }

    connectedCallback() {
        super.connectedCallback()
        this.classList.add(wrapperStyle)
    }

    attributeChangedCallback(name: string, newValue: string | null) {
        if (name === 'appbar') {
            const showAppBar = newValue !== null

            if (showAppBar) {
                this.style.setProperty(
                    'paddingBottom',
                    'calc(env(safe-area-inset-bottom) + 19rem)'
                )
                this.appBar.show()
            } else {
                this.style.setProperty(
                    'paddingBottom',
                    'env(safe-area-inset-bottom)'
                )
                this.appBar.hide()
            }
        }
    }

    get appBar() {
        if (!this._appBar) {
            const appbarInstance = document.createElement(APP_BAR)
            console.log(appbarInstance)

            if (!(appbarInstance instanceof AppBar)) {
                throw new Error('Cannot build appbar instance')
            }

            this.appendChild(appbarInstance)
            this._appBar = appbarInstance
        }

        return this._appBar
    }
}

DefineOnce.define('app-wrapper', AppWrapper)
