"use client";
// src/app/history/DeleteButton.tsx

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
    const res = await fetch(`/api/sessions/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.refresh();
    } else {
      alert("削除に失敗しました");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg transition-colors text-sm"
    >
      削除
    </button>
  );
}
