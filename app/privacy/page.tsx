export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-3 text-[#eaeafd]">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#7B80FF] via-[#B16AFF] to-[#38FFD5] bg-clip-text text-transparent">Privacy Policy</h1>
      <div className="mb-6 text-[#b6c8f7] text-base space-y-3">
        <p>
          <b>Ritik Tracker</b> respects your privacy. All your habit, study, and health data is stored securely using <b>Firebase</b> and is never shared or sold to third-parties. You control your data at all times.
        </p>
        <p>
          <b>Data Storage:</b> Your data (like habits, progress, entries) is stored in a secure cloud database. No sensitive info is ever made public.
        </p>
        <p>
          <b>Authentication:</b> Only you can access and edit your data (using email or Google signin).
        </p>
        <p>
          <b> No Tracking Pixels:</b> We do not show ads or track you across the web.
        </p>
        <p>
          <b>Cookies:</b> Only essential cookies are set to keep you logged in. No advertising cookies.
        </p>
        <p>
          <b>Questions?</b> Email <a href="mailto:bhagoliyaritik@gmail.com" className="text-[#38FFD5] underline">bhagoliyaritik@gmail.com</a> for any privacy related concerns.
        </p>
      </div>
      <div className="text-xs text-[#b4bed2]">Last updated: 2026</div>
    </div>
  );
}