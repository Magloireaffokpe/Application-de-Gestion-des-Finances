"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "./api";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  PlusCircle,
  TrendingDown,
  TrendingUp,
  Wallet,
  Activity,
  Trash,
} from "lucide-react";

type Transaction = {
  id: string;
  text: string;
  amount: number;
  created_at: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [text, setText] = useState<string>("");
  const [amount, setAmount] = useState<number | string>("");
  const [loading, setLoading] = useState(false);

  const getTransactions = async () => {
    try {
      const res = await api.get<Transaction[]>("transactions/");
      setTransactions(res.data);
      toast.success("Transactions chargées");
    } catch (error) {
      console.error("Erreur chargement transactions", error);
      toast.error("Erreur de chargement des transactions");
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`transactions/${id}/`);
      getTransactions();
      toast.success("Transaction supprimée avec succès");
    } catch (error) {
      console.error("Erreur suppression transaction", error);
      toast.error("Erreur suppression transaction");
    }
  };

  const addTransaction = async () => {
    if (!text || amount === "" || isNaN(Number(amount))) {
      toast.error("Merci de remplir texte et montant valides");
      return;
    }
    setLoading(true);
    try {
      await api.post<Transaction>(`transactions/`, {
        text,
        amount: Number(amount),
      });
      getTransactions();

      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;

      if (modal) {
        modal.close();
      }

      toast.success("Transaction ajoutée avec succès");
      setText("");
      setAmount("");
    } catch (error) {
      console.error("Erreur d'ajout de transaction", error);
      toast.error("Erreur ajout transaction");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const amounts = transactions.map((t) => Number(t.amount) || 0);
  const balance = amounts.reduce((acc, item) => acc + item, 0) || 0;
  const income =
    amounts.filter((a) => a > 0).reduce((acc, item) => acc + item, 0) || 0;
  const expense =
    amounts.filter((a) => a < 0).reduce((acc, item) => acc + item, 0) || 0;

  const ratio =
    income > 0 ? Math.min((Math.abs(expense) / income) * 100, 100) : 0;

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4">
      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-4 sm:p-6">
        <div className="flex flex-col gap-2">
          <div className="badge badge-soft gap-1">
            <Wallet className="w-4 h-4" />
            Votre Solde
          </div>
          <div className="text-2xl sm:text-3xl font-bold">
            {balance.toFixed(2)} €
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="badge badge-soft badge-success gap-1">
            <ArrowUpCircle className="w-4 h-4" />
            Revenus
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-success">
            {income.toFixed(2)} €
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="badge badge-soft badge-error gap-1">
            <ArrowDownCircle className="w-4 h-4" />
            Dépenses
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-error">
            {Math.abs(expense).toFixed(2)} €
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-4 sm:p-6">
        <div className="flex justify-between items-center mb-3">
          <div className="badge badge-soft badge-warning gap-1">
            <Activity className="w-4 h-4" />
            Dépenses vs Revenus
          </div>
          <div className="font-semibold">{ratio.toFixed(0)}%</div>
        </div>
        <progress
          className="progress progress-warning w-full"
          value={ratio}
          max={100}
        ></progress>
      </div>

      {/* Add Transaction Button */}
      <button
        className="btn btn-warning w-full sm:w-auto"
        onClick={() =>
          (
            document.getElementById("my_modal_3") as HTMLDialogElement
          ).showModal()
        }
      >
        <PlusCircle className="w-5 h-5" />
        Ajouter une transaction
      </button>

      {/* Transactions Table - Responsive */}
      <div className="overflow-x-auto rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th className="hidden sm:table-cell">#</th>
              <th>Description</th>
              <th>Montant</th>
              <th className="hidden lg:table-cell">Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-base-content/50"
                >
                  Aucune transaction pour le moment
                </td>
              </tr>
            ) : (
              transactions.map((t, index) => (
                <tr key={t.id}>
                  <th className="hidden sm:table-cell">{index + 1}</th>
                  <td className="max-w-[150px] sm:max-w-none truncate">
                    {t.text}
                  </td>
                  <td className="font-semibold">
                    <div className="flex items-center gap-1 sm:gap-2">
                      {t.amount > 0 ? (
                        <TrendingUp className="text-success w-5 h-5 flex-shrink-0" />
                      ) : (
                        <TrendingDown className="text-error w-5 h-5 flex-shrink-0" />
                      )}
                      <span
                        className={t.amount > 0 ? "text-success" : "text-error"}
                      >
                        {t.amount > 0 ? `+${t.amount}` : `${t.amount}`} €
                      </span>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell text-sm">
                    {formatDate(t.created_at)}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="btn btn-sm btn-error btn-soft"
                      title="Supprimer"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <dialog id="my_modal_3" className="modal backdrop-blur">
        <div className="modal-box border-2 border-warning/10 border-dashed max-w-md w-full mx-4">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">Ajouter une transaction</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text">Texte</span>
              </label>
              <input
                type="text"
                name="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Entrer le texte..."
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text">
                  Montant (négatif = dépense, positif = revenu)
                </span>
              </label>
              <input
                type="number"
                name="amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Entrer le montant..."
                className="input input-bordered w-full"
                step="0.01"
              />
            </div>
            <button
              type="button"
              className="w-full btn btn-warning"
              onClick={addTransaction}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Ajouter
                </>
              )}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
