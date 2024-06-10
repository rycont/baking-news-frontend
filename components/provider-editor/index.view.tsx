import { For, Match, Suspense, Switch } from 'solid-js'

import '@shade/elements/chip'
import Spinner from '@shade/icons/animated/spinner.svg?component-solid'
import PenIcon from '@shade/icons/Pen.svg?url'

import style from './style.css'
import { popAppearProgressiveStyle } from '@shade/theme.css'

export function ProviderEditorView(props: { usingProviders: string[] }) {
    return (
        <sh-card class="bk-progressively-appear">
            <sh-subtitle> 사용할 출처 </sh-subtitle>

            <Suspense
                fallback={
                    <sh-vert x="center" y="center" data-filly>
                        <Spinner color="var(--bk-color-l4)" />
                    </sh-vert>
                }
            >
                <Switch
                    fallback={
                        <div
                            class={[
                                style.providerList,
                                popAppearProgressiveStyle,
                            ].join(' ')}
                        >
                            <For each={props.usingProviders}>
                                {(provider) => (
                                    <info-card
                                        class={popAppearProgressiveStyle}
                                    >
                                        {provider}
                                    </info-card>
                                )}
                            </For>
                        </div>
                    }
                >
                    <Match when={props.usingProviders.length === 0}>
                        <info-card class={popAppearProgressiveStyle}>
                            사용중인 출처가 없어요. 출처를 등록하면 맞춤
                            뉴스레터를 구워줄게요.
                        </info-card>
                    </Match>
                </Switch>

                <a href="/config/provider/index.html?redirect=/newsletter/index.html">
                    <sh-button type="ghost">
                        <img src={PenIcon} alt="펜 아이콘" />
                        수정
                    </sh-button>
                </a>
            </Suspense>
        </sh-card>
    )
}
