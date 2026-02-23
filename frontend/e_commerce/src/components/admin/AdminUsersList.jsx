import { Trash2 } from "lucide-react";

const AdminUsersList = ({ users, userInfo, handleDeleteUser, handleVerifySeller }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 border-b">
                    <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Action</th></tr>
                </thead>
                <tbody className="divide-y">
                    {users.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium">{u.name}</td>
                            <td className="p-4 text-gray-600">{u.email}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-red-100 text-red-600' :
                                    u.role === 'seller' ? 'bg-indigo-100 text-indigo-600' :
                                        'bg-green-100 text-green-600'
                                    }`}>
                                    {u.role}
                                </span>
                                {u.role === 'seller' && (
                                    <span className={`ml-2 px-2 py-1 rounded text-xs font-bold uppercase ${u.isVerified ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-yellow-50 text-yellow-600 border border-yellow-200'}`}>
                                        {u.isVerified ? 'Verified' : 'Pending'}
                                    </span>
                                )}
                            </td>
                            <td className="p-4 flex items-center gap-2">
                                {u.role === 'seller' && !u.isVerified && (
                                    <button
                                        onClick={() => handleVerifySeller(u._id, u.name)}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700 transition"
                                    >
                                        Approve
                                    </button>
                                )}
                                {u.role !== 'admin' && (
                                    <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsersList;
