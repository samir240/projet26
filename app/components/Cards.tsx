// components/Card.tsx
export function Cards({ title, value }: { title: string, value: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-500">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}