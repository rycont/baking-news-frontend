import { assert } from './assert'

export const getElements = <K extends (string[])[number], T extends Record<K, typeof HTMLElement>>(
    targets: T
) => {
    const elements: Partial<Record<K, HTMLElement>> = {}

    for (const key of Object.keys(targets) as K[]) {
        elements[key] = getElementAssurely(key)
    }

    return elements as {
        [K in keyof T]: InstanceType<T[K]>
    }
}

function getElementAssurely(id: string) {
    const element = document.getElementById(id)
    assert(element)
    return element
}
