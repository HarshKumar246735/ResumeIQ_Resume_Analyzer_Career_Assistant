import { useCallback, useEffect, useState } from 'react';

// Runs `fn` on mount and whenever `deps` change; exposes loading/error/data and a reload function.
export default function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: '', loading: true });
  const run = useCallback(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true, error: '' }));
    fn().then((data) => live && setState({ data, error: '', loading: false }))
      .catch((e) => live && setState({ data: null, error: e.message, loading: false }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => run(), [run]);
  return { ...state, reload: run };
}
