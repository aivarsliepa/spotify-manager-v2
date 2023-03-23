import { useRouter } from "next/router";
import { memo, useCallback, useMemo } from "react";
import { useSongFilterSettings } from "../../../hooks";
import { trpc } from "../../../utils/trpc";
import type { TCheckboxState } from "../../Checkbox";
import Checkbox, { CheckboxState } from "../../Checkbox";

const FilterPanel = () => {
  const router = useRouter();
  const filterSettings = useSongFilterSettings();

  const { labels, excludeLabels, playlists, excludePlaylists } = useMemo(() => {
    const labels = new Set(filterSettings.labels);
    const excludeLabels = new Set(filterSettings.excludeLabels);
    const playlists = new Set(filterSettings.playlists);
    const excludePlaylists = new Set(filterSettings.excludePlaylists);

    return { labels, excludeLabels, playlists, excludePlaylists };
  }, [filterSettings]);

  const { data: labelData } = trpc.labels.getAll.useQuery();
  const { data: playlistData } = trpc.playlists.getAll.useQuery();

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();

    labels.forEach((label) => params.append("labels", label));
    excludeLabels.forEach((label) => params.append("excludeLabels", label));
    playlists.forEach((playlist) => params.append("playlists", playlist));
    excludePlaylists.forEach((playlist) => params.append("excludePlaylists", playlist));

    if (Array.from(params.keys()).length === 0) {
      router.push(`/songs`, undefined, { shallow: true });
    } else {
      router.push(`/songs?${params.toString()}`, undefined, { shallow: true });
    }
  }, [labels, excludeLabels, playlists, excludePlaylists, router]);

  const onLabelChange = useCallback(
    (labelId: string, state: TCheckboxState) => {
      if (state === CheckboxState.checked) {
        labels.add(labelId);
        excludeLabels.delete(labelId);
      } else if (state === CheckboxState.indeterminate) {
        labels.delete(labelId);
        excludeLabels.add(labelId);
      } else {
        labels.delete(labelId);
        excludeLabels.delete(labelId);
      }

      updateUrl();
    },
    [excludeLabels, labels, updateUrl],
  );

  const onPlaylistChange = useCallback(
    (playlistId: string, state: TCheckboxState) => {
      if (state === CheckboxState.checked) {
        playlists.add(playlistId);
        excludePlaylists.delete(playlistId);
      } else if (state === CheckboxState.indeterminate) {
        playlists.delete(playlistId);
        excludePlaylists.add(playlistId);
      } else {
        playlists.delete(playlistId);
        excludePlaylists.delete(playlistId);
      }

      updateUrl();
    },
    [excludePlaylists, playlists, updateUrl],
  );

  const labelList = useMemo(() => {
    return labelData?.map((label) => {
      const state = labels.has(label.id)
        ? CheckboxState.checked
        : excludeLabels.has(label.id)
        ? CheckboxState.indeterminate
        : CheckboxState.unchecked;
      return <Checkbox key={label.id} label={label.name} state={state} onChange={(state) => onLabelChange(label.id, state)} />;
    });
  }, [excludeLabels, labelData, labels, onLabelChange]);

  const playlistList = useMemo(() => {
    return playlistData?.map((playlist) => {
      const state = playlists.has(playlist.spotifyId)
        ? CheckboxState.checked
        : excludePlaylists.has(playlist.spotifyId)
        ? CheckboxState.indeterminate
        : CheckboxState.unchecked;
      return (
        <Checkbox
          key={playlist.spotifyId}
          state={state}
          label={playlist.name}
          onChange={(state) => onPlaylistChange(playlist.spotifyId, state)}
        />
      );
    });
  }, [excludePlaylists, onPlaylistChange, playlistData, playlists]);

  if (!labelData || !playlistData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex max-h-[300px] gap-8 overflow-y-auto rounded-lg bg-white p-7 shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="relative flex flex-col gap-8">
        Labels:
        {labelList}
      </div>
      <div className="relative flex flex-col gap-8">
        Playlists:
        {playlistList}
      </div>
    </div>
  );
};

export default memo(FilterPanel);
