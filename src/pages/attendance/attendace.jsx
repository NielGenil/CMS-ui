export default function AttendancePage() {
  return (
    <main className="w-full">
      <h1>Attendance</h1>
      <button className="bg-green-600 p-2 text-white rounded hover:bg-green-700">
        Time-in
      </button>

      <button className="bg-red-600 p-2 text-white rounded hover:bg-red-700">
        Time-out
      </button>
    </main>
  );
}
