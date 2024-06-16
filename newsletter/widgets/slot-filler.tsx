import { InterestEditor } from '@components/interest-editor'
import { popAppearProgressiveStyle } from '@shade/theme.css'
import { Show } from 'solid-js'
import { refetchMe } from '../storage'
import { getMe } from '@/entity/user/getMe'

function SlotFiller(props: { reason: 'no-interests' | 'no-using-providers' }) {
    return (
        <>
            <Show when={props.reason === 'no-interests'}>
                <sh-title>관심사가 등록되지 않았어요</sh-title>
                <InterestEditor />
                <sh-button
                    size="big"
                    class={popAppearProgressiveStyle}
                    onClick={() => {
                        getMe.clearCache()
                        refetchMe()
                    }}
                >
                    <img src="/shade-ui/icons/Send.svg" alt="전송 아이콘" />
                    입력 완료
                </sh-button>
            </Show>
            <Show when={props.reason === 'no-using-providers'}>
                <sh-title>어떤 출처에서 글을 받아올까요?</sh-title>
                <provider-editor />
            </Show>
        </>
    )
}

export default SlotFiller
