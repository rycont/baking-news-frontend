import '@shade/elements/checkbox'
import { providerTextWrapperStyle, providerUrlStyle } from './style.css'
import { allProviders, setUsingProviderIds, usingProviderIds } from './storage'
import { JSX } from 'solid-js'
import { pb } from '@/db'
import { Collections } from '@/pocketbase-types'

function ProviderItemView(props: {
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

const onChange = async (checked: boolean, id: string) => {
    if (!pb.authStore.model) {
        location.href = '/login/index.html'
        return
    }

    let newUsingProviderIds = usingProviderIds()

    if (checked) {
        newUsingProviderIds = [...newUsingProviderIds, id]
    } else {
        newUsingProviderIds = newUsingProviderIds.filter((p) => p !== id)
    }

    setUsingProviderIds(newUsingProviderIds)

    await pb.collection(Collections.Users).update(pb.authStore.model.id, {
        using_providers: newUsingProviderIds,
    })
}

function ProviderItem(props: { id: string }) {
    const provider = allProviders.find((p) => p.id === props.id)

    if (!provider) {
        return null
    }

    return (
        <ProviderItemView
            name={provider.name}
            url={provider.url}
            enabled={isProviderEnabled(props.id)}
            onChange={(e) => onChange(e.target.checked, props.id)}
        />
    )
}

function isProviderEnabled(id: string) {
    return usingProviderIds().includes(id)
}

export default ProviderItem
