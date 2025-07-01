import { useEffect, useRef } from "react";

/**
 * Custom hook that ensures useEffect runs only once, even in React StrictMode
 * @param effect - The effect function to run once
 * @param deps - Optional dependency array (if provided, effect runs once when deps change)
 */
export function useEffectOnce(
    effect: () => void | (() => void),
    deps?: React.DependencyList,
) {
    const hasRun = useRef(false);

    useEffect(() => {
        // If no dependencies provided, run only once ever
        if (!deps) {
            if (!hasRun.current) {
                hasRun.current = true;
                return effect();
            }
            return;
        }

        // If dependencies provided, run normally with deps
        return effect();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

export default useEffectOnce;
