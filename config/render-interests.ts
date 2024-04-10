import { pb } from '../db'
import { assert } from '../utils/assert'
import { getElements } from '../utils/getElements'
import { getMe } from '../utils/getMe'
import { isValidInterests } from '../utils/isValidInterests'
import throttle from '../utils/throttle'
import { hideLoading, showLoading } from './showLoading'

const elements = getElements({
    interests_list: HTMLDivElement,
    interests_item: HTMLTemplateElement,
    add_interest: HTMLButtonElement,
    no_interests: HTMLDivElement,
})

renderLoadedInterests()

elements.add_interest.addEventListener('click', createNewInterest)

async function renderLoadedInterests() {
    let interests = await getInterests()

    for (const interest of interests) {
        const item = buildItem(interest)
        elements.interests_list.appendChild(item)
    }
}

function createNewInterest() {
    const item = buildItem('')
    elements.interests_list.appendChild(item)
    setEmptyMessage(false)
}

async function getInterests() {
    const me = await getMe()
    const loadedInterests = me.interests || []

    assert(isValidInterests(loadedInterests))
    return loadedInterests
}

function buildItem(value: string) {
    const item = elements.interests_item.content.cloneNode(true) as HTMLElement

    const input = item.querySelector('input') as HTMLInputElement
    const removeButton = item.querySelector('img') as HTMLImageElement

    assert(input)
    assert(removeButton)

    input.value = value

    removeButton.addEventListener('click', onRemoveItem)
    input.addEventListener('input', onInput)

    return item
}

async function onRemoveItem(e: Event) {
    if (elements.interests_list.children.length === 1) {
        alert('최소 한개의 관심사는 있어야 합니다')
        return
    }

    const removeButton = getElementFromEvent(e)

    const element = removeButton.closest('.interests_item') as HTMLElement
    assert(element)

    element.remove()

    await updateInterests()

    if (elements.interests_list.children.length === 0) {
        setEmptyMessage(true)
    }
}

function setEmptyMessage(state: boolean) {
    elements.no_interests.style.display = state ? 'block' : 'none'
}

function onInput() {
    updateInterests()
}

const updateInterests = throttle(async () => {
    assert(pb.authStore.model)
    const myId = pb.authStore.model.id

    const inputs = elements.interests_list.querySelectorAll('input')
    const interests = Array.from(
        new Set(
            Array.from(inputs)
                .map((input) => input.value.trim())
                .filter(Boolean)
        )
    )

    showLoading()
    await pb.collection('users').update(myId, {
        interests,
    })
    hideLoading()
}, 1000)

function getElementFromEvent(e: Event) {
    const target = e.target
    assert(target instanceof HTMLElement)

    return target
}
