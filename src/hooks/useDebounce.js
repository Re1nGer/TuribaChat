const useDebounce = (func, milliseconds) => {
    const time = milliseconds || 400
    let timer

    return event => {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(func, time, event)
    }
}

export default useDebounce;