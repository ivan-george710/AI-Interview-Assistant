"use client";

interface Props {
  solved: number;

  total: number;

  xp: number;

  favorites: number;

  bookmarks: number;
}

export default function ProgressHeader({
  solved,
  total,
  xp,
  favorites,
  bookmarks,
}: Props) {
  return (
    <div className="grid grid-cols-5 gap-4">

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-slate-400 text-sm">
          Solved
        </p>

        <h2 className="text-2xl font-bold">
          {solved}/{total}
        </h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-slate-400 text-sm">
          XP
        </p>

        <h2 className="text-2xl font-bold">
          {xp}
        </h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-slate-400 text-sm">
          Favorites
        </p>

        <h2 className="text-2xl font-bold">
          {favorites}
        </h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-slate-400 text-sm">
          Bookmarks
        </p>

        <h2 className="text-2xl font-bold">
          {bookmarks}
        </h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-slate-400 text-sm">
          Progress
        </p>

        <h2 className="text-2xl font-bold">
          {Math.round(
            (solved /
              Math.max(
                total,
                1
              )) *
              100
          )}
          %
        </h2>
      </div>

    </div>
  );
}