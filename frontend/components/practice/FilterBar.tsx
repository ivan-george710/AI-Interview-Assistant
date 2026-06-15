"use client";

interface FilterBarProps {
  search: string;
  setSearch: (value: string) => void;

  difficultyFilter: string;
  setDifficultyFilter: (
    value: string
  ) => void;

  companyFilter: string;
  setCompanyFilter: (
    value: string
  ) => void;

  topicFilter: string;
  setTopicFilter: (
    value: string
  ) => void;
}

export default function FilterBar({
  search,
  setSearch,
  difficultyFilter,
  setDifficultyFilter,
  companyFilter,
  setCompanyFilter,
  topicFilter,
  setTopicFilter,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="text"
        placeholder="Search Questions..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white"
      />

      <select
        value={
          difficultyFilter
        }
        onChange={(e) =>
          setDifficultyFilter(
            e.target.value
          )
        }
        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2"
      >
        <option>
          All
        </option>

        <option>
          Easy
        </option>

        <option>
          Medium
        </option>

        <option>
          Hard
        </option>
      </select>

      <select
        value={companyFilter}
        onChange={(e) =>
          setCompanyFilter(
            e.target.value
          )
        }
        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2"
      >
        <option>
          All
        </option>

        <option>
          Google
        </option>

        <option>
          Amazon
        </option>

        <option>
          Microsoft
        </option>

        <option>
          Meta
        </option>
      </select>

      <select
        value={topicFilter}
        onChange={(e) =>
          setTopicFilter(
            e.target.value
          )
        }
        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2"
      >
        <option>
          All
        </option>

        <option>
          Array
        </option>

        <option>
          String
        </option>

        <option>
          Linked List
        </option>

        <option>
          Tree
        </option>

        <option>
          Graph
        </option>

        <option>
          DP
        </option>
      </select>
    </div>
  );
}