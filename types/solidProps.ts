import { JSX } from 'solid-js'

export type SolidProps<T, E extends HTMLElement = HTMLElement> = Omit<
    JSX.HTMLAttributes<E>,
    'children'
> & {
    key?: string
    children?: any
} & T & {
        [key in keyof T as `attr:${string & key}`]: T[key] | null
    }

import { ShadeHovertProps, horz, vert } from '@shade/dist/elements/hovert'
import Card, { ShadeCardProps } from '@shade/dist/elements/card'
import Chip, { ShadeChipProps } from '@shade/dist/elements/chip'
import Button, { ShadeButtonProps } from '@shade/dist/elements/button'
import Divider, { ShadeDividerProps } from '@shade/dist/elements/divider'
import Checkbox, { ShadeCheckboxProps } from '@shade/dist/elements/checkbox'
import Input, { ShadeInputProps } from '@shade/dist/elements/input'
import { ShadeTypoProps } from '@shade/dist/elements/typo'
import GradualRenderer, {
    GradualRendererProps,
} from '@components/gradual-renderer'
import InfoCard from '@components/info-card'

declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            [Card]: SolidProps<ShadeCardProps>
            'sh-subtitle': SolidProps<ShadeTypoProps>
            'sh-text': SolidProps<ShadeTypoProps>
            'sh-title': SolidProps<ShadeTypoProps>
            'sh-small-text': SolidProps<ShadeTypoProps>
            [Button]: SolidProps<ShadeButtonProps, HTMLButtonElement>
            [vert]: SolidProps<ShadeHovertProps>
            [horz]: SolidProps<ShadeHovertProps>
            [Chip]: SolidProps<ShadeChipProps>
            [GradualRenderer]: SolidProps<GradualRendererProps>
            [Checkbox]: SolidProps<ShadeCheckboxProps, HTMLInputElement>
            [Divider]: SolidProps<ShadeDividerProps>
            [Input]: SolidProps<ShadeInputProps, HTMLInputElement>
            [InfoCard]: SolidProps<{}, HTMLElement>
        }
    }
}
