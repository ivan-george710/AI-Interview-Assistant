export default function TestPage() {
  return (
    <div>
      URL:
      {process.env.NEXT_PUBLIC_SUPABASE_URL}
    </div>
  );
}