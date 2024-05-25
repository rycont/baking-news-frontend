import { DefineOnce } from '../../shade-ui/util'
import { appbarStyle, itemIconWrapperStyle, itemStyle } from './style.css'

import flatBreadSVG from '../../assets/flat-bread.svg?raw'
import cog from '../../shade-ui/icons/Setting.svg?raw'

import { TOKEN } from '../../shade-ui/dist/typo'

interface AppbarItem {
    icon: string
    label: string
    link: string
}

const ITEMS: AppbarItem[] = [
    {
        icon: flatBreadSVG,
        label: '뉴스레터',
        link: '/newsletter',
    },
    {
        icon: cog,
        label: '설정',
        link: '/setting',
    },
]

export class AppBar extends HTMLElement {
    private static items: AppbarItem[] = ITEMS

    constructor() {
        super()
    }

    connectedCallback() {
        this.classList.add(appbarStyle)
        this.buildItems(ITEMS)
    }

    buildItems(items: AppbarItem[]) {
        for (let item of items) {
            const itemElement = this.buildItem(item)
            this.appendChild(itemElement)
        }
    }

    buildItem(item: AppbarItem) {
        const itemElement = document.createElement('div')
        itemElement.classList.add(itemStyle)

        const iconWrapper = document.createElement('span')
        iconWrapper.classList.add(itemIconWrapperStyle)
        iconWrapper.innerHTML = item.icon
        itemElement.appendChild(iconWrapper)

        const textElement = document.createElement(TOKEN)
        textElement.appendChild(document.createTextNode(item.label))
        itemElement.appendChild(textElement)

        return itemElement
    }

    show() {
        // TODO: Implement
    }
}

export const APP_BAR = 'app-bar'
DefineOnce.define(APP_BAR, AppBar)
