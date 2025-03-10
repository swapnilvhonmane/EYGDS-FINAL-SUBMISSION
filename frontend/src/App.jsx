import { useState } from 'react';
import { format } from 'date-fns';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Groceries', amount: 150, date: '2024-02-15', category: 'Food' },
    { id: 2, description: 'Internet Bill', amount: 60, date: '2024-02-14', category: 'Utilities' },
    { id: 3, description: 'Movie Night', amount: 30, date: '2024-02-13', category: 'Entertainment' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    category: 'Food'
  });

  const categories = ['Food', 'Utilities', 'Entertainment', 'Transport', 'Shopping', 'Other'];

  const chartData = {
    labels: expenses.map(exp => format(new Date(exp.date), 'MMM dd')),
    datasets: [
      {
        label: 'Expenses',
        data: expenses.map(exp => exp.amount),
        borderColor: '#0EA5E9',
        tension: 0.4
      }
    ]
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    };
    setExpenses([...expenses, expense]);
    setShowAddModal(false);
    setNewExpense({
      description: '',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'Food'
    });
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Personal Finance Manager</h1>
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus /> Add Expense
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Total Expenses</h2>
            <p className="text-4xl font-bold text-primary">${totalExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Expense Trend</h2>
            <Line data={chartData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(expense.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4">{expense.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">${expense.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="text-red-600 hover:text-red-900 ml-2"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
            <form onSubmit={handleAddExpense}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="input-field"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;