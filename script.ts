import { pb } from './db'
import { assert } from './utils/assert'

const isLoggedIn = pb.authStore.isValid

if (!isLoggedIn) {
    location.href = '/login/index.html'
}

assert(pb.authStore.model)

const interests = pb.authStore.model.interests

if (!interests) {
    location.href = '/setting-required/index.html'
}
