import { JSX } from 'solid-js'
import '@shade/elements/checkbox'

import { providerTextWrapperStyle, providerUrlStyle } from './style.css'

export default function ProviderItem(props: {
    name: string
    url: string
    enabled: boolean
    onChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event>
}) {
    return (
        <label>
            <sh-horz x="space" y="center" gap={3}>
                <sh-vert gap={1} class={providerTextWrapperStyle}>
                    <sh-subtitle>{props.name}</sh-subtitle>
                    <sh-text L6 class={providerUrlStyle}>
                        {props.url}
                    </sh-text>
                </sh-vert>
                <sh-checkbox
                    attr:checked={props.enabled ? true : null}
                    onChange={props.onChange}
                />
            </sh-horz>
        </label>
    )
}
