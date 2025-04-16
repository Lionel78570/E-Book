'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  name: string;
  email: string;
  message: string;
  date: string;
  status?: "accepted" | "rejected";
};

export default function AdminPage() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [historyUsers, setHistoryUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const isAdmin = localStorage.getItem("isAdmin");
    if (email !== "admin@ebook.com" || isAdmin !== "true") {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    async function fetchUsers() {
      const [pendingRes, historyRes] = await Promise.all([
        fetch("/api/manage-user"),
        fetch("/api/history-user"),
      ]);
      const pendingData = await pendingRes.json();
      const historyData = await historyRes.json();
      setPendingUsers(pendingData);
      setHistoryUsers(historyData);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const handleAction = async (email: string, action: "accept" | "reject") => {
    await fetch("/api/manage-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action }),
    });

    const user = pendingUsers.find((u) => u.email === email);
    if (!user) return;

    const updatedUser: User = {
      ...user,
      status: action === "accept" ? "accepted" : "rejected",
    };

    setPendingUsers((prev) => prev.filter((u) => u.email !== email));
    setHistoryUsers((prev) => [updatedUser, ...prev]);
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard Admin</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Inscriptions en attente</h2>
        {pendingUsers.length === 0 ? (
          <p className="text-gray-500">Aucune inscription en attente.</p>
        ) : (
          <ul className="space-y-4">
            {pendingUsers.map((user, index) => {
              // Création d'une clé unique pour chaque élément
              const uniqueKey = user.email + (user.status || "no-status") + index;

              return (
                <li
                  key={uniqueKey}
                  className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
                >
                  <p>
                    <strong>Nom :</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email :</strong> {user.email}
                  </p>
                  <p>
                    <strong>Message :</strong> {user.message}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(user.date).toLocaleString()}
                  </p>
                  <p className="mt-2 font-medium text-sm">
                    Statut :{" "}
                    <span
                      className={
                        user.status === "accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {user.status === "accepted" ? "Accepté" : "Refusé"}
                    </span>
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAction(user.email, "accept")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:opacity-90"
                    >
                      Accepter
                    </button>
                    <button
                      onClick={() => handleAction(user.email, "reject")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90"
                    >
                      Refuser
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Historique des décisions</h2>
        {historyUsers.length === 0 ? (
          <p className="text-gray-500">Aucune action enregistrée.</p>
        ) : (
          <ul className="space-y-4">
            {historyUsers.map((user, index) => {
              // Création d'une clé unique pour chaque élément de l'historique
              const uniqueKey = user.email + (user.status || "no-status") + index;

              return (
                <li
                  key={uniqueKey}
                  className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
                >
                  <p>
                    <strong>Nom :</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email :</strong> {user.email}
                  </p>
                  <p>
                    <strong>Message :</strong> {user.message}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(user.date).toLocaleString()}
                  </p>
                  <p className="mt-2 font-medium text-sm">
                    Statut :{" "}
                    <span
                      className={
                        user.status === "accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {user.status === "accepted" ? "Accepté" : "Refusé"}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
