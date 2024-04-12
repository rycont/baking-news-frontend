import { pb } from '../db'
import { getElements } from '../utils/getElements'

const buttons = getElements({
    // login_with_google: HTMLButtonElement,
    login_with_kakao: HTMLButtonElement,
})

// buttons.login_with_google.addEventListener('click', () =>
//     loginWithProvider('google')
// )

buttons.login_with_kakao.addEventListener('click', () =>
    loginWithProvider('kakao')
)

type LoadState =
    | {
          state: 'loading'
      }
    | {
          state: 'loaded'
          link: string
      }

const loginLinks: Record<string, LoadState> = {}

function loginWithProvider(providerKey: string) {
    if (!(providerKey in loginLinks)) {
        loginLinks[providerKey] = { state: 'loading' }

        pb.collection('users')
            .authWithOAuth2({
                provider: providerKey,
                urlCallback(url) {
                    loginLinks[providerKey] = { state: 'loaded', link: url }
                },
            })
            .then(() => {
                location.href = '/'
            })
    } else {
        const provider = loginLinks[providerKey]

        if (provider.state === 'loaded') {
            window.open(provider.link, '_blank', 'popup, width=500, height=600')
            return
        }
    }

    setTimeout(() => loginWithProvider(providerKey), 50)
}
