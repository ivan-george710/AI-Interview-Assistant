-- Practice module identifier alignment.
-- questions.id is a slug text value (for example: "palindrome-number").
-- submissions.problem_id must store that same value for history lookups.

alter table public.submissions
  alter column problem_id type text
  using problem_id::text;

-- Best-effort cleanup for legacy rows that stored public.problems.id.
-- This maps "1" -> "two-sum" when problems.title matches questions.title
-- after stripping the leading numbering used by Practice question titles.
update public.submissions as s
set problem_id = q.id
from public.problems as p
join public.questions as q
  on lower(regexp_replace(q.title, '^\s*\d+\.\s*', '')) = lower(p.title)
where s.problem_id = p.id::text;
