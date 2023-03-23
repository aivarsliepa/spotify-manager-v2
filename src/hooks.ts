import { useRouter } from "next/router";
import { useMemo } from "react";

export function useSongFilterSettings() {
  const router = useRouter();

  return useMemo(() => {
    const labels = router.query.labels ? (Array.isArray(router.query.labels) ? [...router.query.labels] : [router.query.labels]) : [];
    const excludeLabels = router.query.excludeLabels
      ? Array.isArray(router.query.excludeLabels)
        ? [...router.query.excludeLabels]
        : [router.query.excludeLabels]
      : [];
    const playlists = router.query.playlists
      ? Array.isArray(router.query.playlists)
        ? [...router.query.playlists]
        : [router.query.playlists]
      : [];
    const excludePlaylists = router.query.excludePlaylists
      ? Array.isArray(router.query.excludePlaylists)
        ? [...router.query.excludePlaylists]
        : [router.query.excludePlaylists]
      : [];

    return {
      labels,
      excludeLabels,
      playlists,
      excludePlaylists,
    };
  }, [router]);
}
