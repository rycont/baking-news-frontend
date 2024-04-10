import { getElements } from '../utils/getElements'

const { loading } = getElements({
    loading: HTMLDivElement,
})

let lastShow: number

export const showLoading = () => {
    loading.classList.add('show')
    lastShow = Date.now()
}

export const hideLoading = () => {
    const shownDuration = Date.now() - lastShow

    if (shownDuration > 1000) {
        loading.classList.remove('show')
        return
    }

    setTimeout(() => {
        loading.classList.remove('show')
    }, 1000 - shownDuration)

    return
}
