"use client";

import { useSearchParams, useRouter } from "next/navigation";

export function useQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryObject = {};
  for (const [key, value] of searchParams.entries()) {
    queryObject[key] = /^\d+$/.test(value) ? Number(value) : value;
  }

  const setQuery = (updates) => {
    const newParams = new URLSearchParams(searchParams.toString());

    for (const key in updates) {
      const val = updates[key];
      if (val === null || val === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(val));
      }
    }

    router.replace(`?${newParams.toString()}`);
  };

  return [queryObject, setQuery];
}
