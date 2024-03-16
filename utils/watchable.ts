type Action<T> = (value: T) => void

export class Watchable<T> {
    private actions = new Set<Action<T>>()
    constructor(private _value: T) {}

    get value() {
        return this._value
    }

    set value(value: T) {
        this._value = value

        for (const action of this.actions) {
            action(value)
        }
    }

    listen(action: Action<T>) {
        this.actions.add(action)
        action(this._value)
    }
}
