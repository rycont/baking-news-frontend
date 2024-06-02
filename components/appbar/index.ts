import flatBreadSVG from '@assets/flat-bread.svg?raw'

import cog from '@shade/icons/Setting.svg?raw'
import { DefineOnce } from '@shade/util'
import { TOKEN } from '@shade/dist/elements/typo'

import { appbarStyle, itemIconWrapperStyle, itemStyle } from './style.css'

interface AppbarItem {
    icon: string
    label: string
    link: string
}

const ITEMS: AppbarItem[] = [
    {
        icon: flatBreadSVG,
        label: '뉴스레터',
        link: '/newsletter/index.html',
    },
    {
        icon: cog,
        label: '설정',
        link: '/config/index.html',
    },
]

export class AppBar extends HTMLElement {
    private static items: AppbarItem[] = ITEMS
    private currentItem: AppbarItem | undefined

    constructor() {
        super()

        const currentPath = window.location.pathname
        const currentItem = AppBar.items.find((item) =>
            currentPath.startsWith(item.link)
        )

        this.currentItem = currentItem
    }

    connectedCallback() {
        this.classList.add(appbarStyle)
        this.buildItems(AppBar.items)
    }

    buildItems(items: AppbarItem[]) {
        for (let item of items) {
            const itemElement = this.buildItem(item)
            this.appendChild(itemElement)
        }
    }

    buildItem(item: AppbarItem) {
        const itemElement = document.createElement('a')
        itemElement.classList.add(itemStyle)
        itemElement.href = item.link

        const iconWrapper = document.createElement('span')
        iconWrapper.classList.add(itemIconWrapperStyle)
        iconWrapper.innerHTML = item.icon
        itemElement.appendChild(iconWrapper)

        const textElement = document.createElement(TOKEN)
        textElement.appendChild(document.createTextNode(item.label))
        itemElement.appendChild(textElement)

        if (this.currentItem?.link === item.link) {
            itemElement.setAttribute('aria-current', 'page')
        }

        return itemElement
    }

    show() {
        // TODO: Implement
    }

    hide() {
        // TODO: Implement
    }
}

export const APP_BAR = 'app-bar'
DefineOnce.define(APP_BAR, AppBar)
