import { assert } from './assert'

export const getElements = <T extends Record<string, typeof HTMLElement>>(
    targets: T
) => {
    const elements = {}

    for (const [key, value] of Object.entries(targets)) {
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
