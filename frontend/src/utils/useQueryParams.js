import { useLocation, useNavigate } from "react-router-dom";

export function useQueryParams() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const queryObject = {};
  for (const [key, value] of params.entries()) {
    queryObject[key] = /^\d+$/.test(value) ? Number(value) : value;
  }

  const setQuery = (updates) => {
    const newParams = new URLSearchParams(location.search);

    for (const key in updates) {
      const val = updates[key];
      if (val === null || val === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(val));
      }
    }

    navigate({ search: newParams.toString() }, { replace: true });
  };

  return [queryObject, setQuery];
}
