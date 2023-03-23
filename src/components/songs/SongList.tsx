import { memo, useMemo } from "react";
import { trpc } from "../../utils/trpc";
import OnEntry from "../OnEntry";
import SongListItem from "./SongListItem";
import SongsFilter from "./filter/SongsFilter";
import { useSongFilterSettings } from "../../hooks";

const SongList = () => {
  const { excludeLabels, excludePlaylists, labels, playlists } = useSongFilterSettings();

  const { data, fetchNextPage, refetch } = trpc.songs.getInfinite.useInfiniteQuery(
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

  return (
    <div>
      <SongsFilter />
      <button onClick={() => refetch()} className="rounded-md p-2 hover:bg-slate-200 ">
        REFETCH
      </button>
      <div className="flex flex-col">{songs}</div>
    </div>
  );
};

export default memo(SongList);
