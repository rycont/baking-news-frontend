import { API_URL } from '../constants'
import { pb } from '../db'
import { getElements } from '../utils/getElements'

const elements = getElements({
    add_feed: HTMLButtonElement,
    add_feed_modal: HTMLDialogElement,
    add_feed_form: HTMLFormElement,
})

elements.add_feed.addEventListener('click', () => {
    elements.add_feed_modal.showModal()
})

elements.add_feed_form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const formData = new FormData(elements.add_feed_form)

    const url = formData.get('url') as string
    const name = formData.get('name') as string

    const finished = setLoading()

    try {
        await addProvider(url, name)
        alert('성공적으로 피드를 구독했어요')
        location.reload()
    } catch (e) {
        finished()
        alert('피드 구독에 실패했어요')
    }
})

function setLoading() {
    elements.add_feed_modal.classList.add('loading')

    for (const element of elements.add_feed_form.children) {
        element.setAttribute('disabled', 'true')
    }

    return () => {
        elements.add_feed_modal.classList.remove('loading')

        for (const element of elements.add_feed_form.children) {
            element.removeAttribute('disabled')
        }
    }
}

async function addProvider(url: string, name: string) {
    const token = pb.authStore.token

    await fetch(`${API_URL}/provider`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({ url, name }),
    })
}
