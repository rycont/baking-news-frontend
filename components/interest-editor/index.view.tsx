import { For, Show, Suspense } from 'solid-js'

import Spinner from '@shade/icons/animated/spinner.svg?component-solid'
import PenIcon from '@shade/icons/Pen.svg?url'

import { popAppearStyle } from '@shade/theme.css'
import '@components/info-card'

import InterestItem from './item'

interface InterestEditorViewProps {
    onAddInterest: () => void
    interestsQuantity: number
    noInterests: boolean
}

export function InterestEditorView(props: InterestEditorViewProps) {
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
                    <For each={Array(props.interestsQuantity)}>
                        {(_, index) => <InterestItem index={index()} />}
                    </For>
                    <Show when={props.noInterests}>
                        <info-card class={popAppearStyle}>
                            등록된 관심사가 없어요. 관심사를 등록하면 맞춤
                            뉴스레터를 구워줄게요.
                        </info-card>
                    </Show>
                </sh-vert>
                <sh-button type="ghost" onClick={props.onAddInterest}>
                    <img src={PenIcon} alt="펜 아이콘" />
                    관심사 추가
                </sh-button>
            </Suspense>
        </sh-card>
    )
}
