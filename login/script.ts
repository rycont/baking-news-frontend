import { assert } from '../utils/assert'
import { pb } from '../db'

const buttons = {
    google: document.getElementById('login_with_google'),
}

assert(buttons.google)

buttons.google.addEventListener('click', loginWithGoogle)

async function loginWithGoogle() {
    try {
        await pb.collection('users').authWithOAuth2({ provider: 'google' })
        location.href = '/'
    } catch (error) {
        alert('Error logging in with Google')
    }
}
