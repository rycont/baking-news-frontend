import { smallText } from '@shade/elements/typo/style.css'
import style from './style.css'
import { DefineOnce } from '@shade/util'

export class InfoCard extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.classList.add(style.info, smallText)
    }
}

const NAME = 'info-card'
DefineOnce.define(NAME, InfoCard)
export default NAME
