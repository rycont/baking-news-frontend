import { JSX } from 'solid-js'

import TrashIcon from '@shade/icons/Trash.svg?component-solid'
import { popAppearProgressiveStyle } from '@shade/theme.css'

import { trashButton } from './style.css'

export interface InterestItemViewProps {
    onChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event>
    onRemove: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
    value: string
    autofocus: boolean
}

export function InterestItemView(props: InterestItemViewProps) {
    return (
        <sh-horz class={popAppearProgressiveStyle} y="center">
            <sh-input
                onChange={props.onChange}
                attr:value={props.value}
                attr:placeholder="전통문화"
                autofocus={props.autofocus}
            ></sh-input>
            <button class={trashButton} onClick={props.onRemove}>
                <sh-horz p={3}>
                    <TrashIcon />
                </sh-horz>
            </button>
        </sh-horz>
    )
}
