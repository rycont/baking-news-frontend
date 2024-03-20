export default function throttle<T extends unknown[]>(
    action: (...value: T) => void,
    delay: number
) {
    let timeout: ReturnType<typeof setTimeout> | null = null
    let lastValue: T | null = null

    return (...value: T) => {
        lastValue = value

        if (timeout === null) {
            timeout = setTimeout(() => {
                if (lastValue !== null) {
                    action(...lastValue)
                }

                timeout = null
            }, delay)
        }
    }
}
