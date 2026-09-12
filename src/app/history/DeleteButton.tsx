"use client";
// src/app/history/DeleteButton.tsx

export default function DeleteButton({ id }: { id: number }){
  async function handleDelete() {
    const res = await fetch(`/api/sessions/${id}`, {
         method: "DELETE",
    });
}     

return (
  <button onClick={handleDelete}>
    削除
  </button>
);

}
