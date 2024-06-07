import { customElement, noShadowDOM } from 'solid-element'

import '@shade/elements/button'
import '@shade/elements/input'
import '@shade/elements/card'
import '@shade/elements/typo'

import { InterestEditorView } from './index.view'
import { interestsSignal } from './storage'

function InterestEditor() {
    noShadowDOM()

    return <InterestEditorView onAddInterest={addInterest} />
}

async function addInterest() {
    interestsSignal.set([...(interestsSignal.get() || []), ''])
}

customElement('interest-editor', InterestEditor)
