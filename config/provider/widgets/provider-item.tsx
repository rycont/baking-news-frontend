import '@shade/elements/checkbox'
import { providerTextWrapperStyle, providerUrlStyle } from './style.css'
import { JSX } from 'solid-js'

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

// function ProviderItem(props: { id: string }) {
//     // if (allProviders.state !== 'ready') {
//     //     return null
//     // }

//     const provider = () => allProviders().find((p) => p.id === props.id)

//     // if (!provider) {
//     //     return null
//     // }

//     return (
//         <Switch>
//             <Match when={allProviders.state === 'ready'}>
//                 <ProviderItemView
//                     name={provider().name}
//                     url={provider().url}
//                     enabled={isProviderEnabled(props.id)}
//                     onChange={(e) => onChange(e.target.checked, props.id)}
//                 />
//             </Match>
//         </Switch>
//     )
// }

// function isProviderEnabled(id: string) {
//     return usingProviderIds().includes(id)
// }

// export default ProviderItem
