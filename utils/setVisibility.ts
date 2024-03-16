export function setVisibility(element: HTMLElement, visibility: boolean) {
    const value = visibility ? 'block' : 'none'
    element.style.setProperty('display', value)
}
