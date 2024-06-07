import { For, Suspense } from 'solid-js'

import Spinner from '@shade/icons/animated/spinner.svg?component-solid'
import InterestItem from './item'
import { interestsSignal } from './storage'

export function InterestEditorView(props: { onAddInterest: () => void }) {
    return (
        <sh-card>
            <sh-subtitle> 내 관심사 </sh-subtitle>

            <Suspense
                fallback={
                    <sh-vert x="center" y="center" data-filly>
                        <Spinner color="var(--bk-color-l4)" />
                    </sh-vert>
                }
            >
                <sh-vert gap={2}>
                    <For each={Array(interestsSignal.get()?.length)}>
                        {(_, index) => <InterestItem index={index()} />}
                    </For>
                </sh-vert>
                <sh-button type="ghost" onClick={props.onAddInterest}>
                    <img src="/shade-ui/icons/Pen.svg" alt="펜 아이콘" />
                    관심사 추가
                </sh-button>
            </Suspense>
        </sh-card>
    )
}
