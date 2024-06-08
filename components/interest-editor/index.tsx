import { customElement, noShadowDOM } from 'solid-element'

import '@shade/elements/button'
import '@shade/elements/input'
import '@shade/elements/card'
import '@shade/elements/typo'

import { InterestEditorView } from './index.view'
import { interestsSignal } from './storage'

export function InterestEditor() {
    const interestsQuantity = () => interestsSignal.get()?.length || 0
    const noInterests = () => interestsSignal.get()?.length === 0

    return (
        <InterestEditorView
            onAddInterest={addInterest}
            interestsQuantity={interestsQuantity()}
            noInterests={noInterests()}
        />
    )
}

async function addInterest() {
    interestsSignal.set([...(interestsSignal.get() || []), ''])
}

customElement('interest-editor', () => {
    noShadowDOM()

    return <InterestEditor />
})
