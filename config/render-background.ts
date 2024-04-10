import { getElements } from '../utils/getElements'
import throttle from '../utils/throttle'
import { getMe } from '../utils/getMe'
import { pb } from '../db'
import { Collections } from '../pocketbase-types'
import { hideLoading, showLoading } from './showLoading'

const { background } = getElements({
    background: HTMLTextAreaElement,
})

const me = await getMe()

if (me.background) {
    background.value = me.background
}

background.addEventListener('input', throttle(saveBackground, 1000))

async function saveBackground() {
    showLoading()
    await pb.collection(Collections.Users).update(me.id, {
        background: background.value,
    })
    hideLoading()
}
