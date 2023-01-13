import { memo, useMemo } from "react";
import { trpc } from "../../utils/trpc";
import OnEntry from "../OnEntry";
import SongListItem from "./SongListItem";
import SongsFilter from "./filter/SongsFilter";
import { useRouter } from "next/router";

const SongList = () => {
  const router = useRouter();

  const labels = router.query.labels ? (Array.isArray(router.query.labels) ? router.query.labels : [router.query.labels]) : [];
  const excludeLabels = router.query.excludeLabels
    ? Array.isArray(router.query.excludeLabels)
      ? router.query.excludeLabels
      : [router.query.excludeLabels]
    : [];
  const playlists = router.query.playlists
    ? Array.isArray(router.query.playlists)
      ? router.query.playlists
      : [router.query.playlists]
    : [];
  const excludePlaylists = router.query.excludePlaylists
    ? Array.isArray(router.query.excludePlaylists)
      ? router.query.excludePlaylists
      : [router.query.excludePlaylists]
    : [];

  const { data, isLoading, fetchNextPage } = trpc.songs.getInfinite.useInfiniteQuery(
    { labels, excludeLabels, playlists, excludePlaylists },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const songs = useMemo(() => {
    return data?.pages.map((page, pageIndex) => {
      return page.items.map(({ song }, songIndex) => {
        if (pageIndex === data.pages.length - 1 && songIndex === page.items.length - 1) {
          return (
            <OnEntry key={song.spotifyId} onEntry={fetchNextPage}>
              <SongListItem song={song} />
            </OnEntry>
          );
        }

        return <SongListItem key={song.spotifyId} song={song} />;
      });
    });
  }, [fetchNextPage, data?.pages]);

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SongsFilter />
      <div className="flex flex-col">{songs}</div>
    </div>
  );
};

export default memo(SongList);
