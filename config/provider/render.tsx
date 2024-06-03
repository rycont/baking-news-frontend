import { assert } from '@utils/assert'
import { render } from 'solid-js/web'

import ProviderList from './widgets/provider-list'

const renderTarget = document.getElementById('provider-list')
assert(renderTarget, 'Cannot find renderTarget #app in this document')
render(() => <ProviderList />, renderTarget)
