import { memo, useMemo } from "react";
import { trpc } from "../../utils/trpc";
import OnEntry from "../OnEntry";
import SongListItem from "./SongListItem";

const SongList = () => {
  const { data, isLoading, fetchNextPage } = trpc.songs.getInfinite.useInfiniteQuery(
    {},
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

  return <div className="flex flex-col">{songs}</div>;
};

export default memo(SongList);
