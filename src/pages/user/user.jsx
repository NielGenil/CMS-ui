import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import EditUserPage from "./editUser";
import { deleteUserAPI, RegisterUserAPI, UserListAPI } from "../../api/userAPI";

export default function UserPage() {
  const registerUserRef = useRef(null);
  const queryClient = useQueryClient();
  const [editUserModal, setEditUserModal] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showError, setShowError] = useState(null);

  const { data: userListQuery, isLoading } = useQuery({
    queryKey: ["list-of-user"],
    queryFn: () => UserListAPI(),
  });

  const userList = Array.isArray(userListQuery) ? userListQuery : [];

  const { mutate: registeruser, isPending: isRegistering } = useMutation({
    mutationFn: RegisterUserAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["list-of-user"]);
      console.log("Success");

      // Close the modal after successful registration
      const modalToggle = document.getElementById("modal-toggle");
      if (modalToggle) {
        modalToggle.checked = false;
      }
    },
    onError: (error) => {
      console.log(error);
      setShowError(error.email?.[0]);
    },
  });

  const registerUserSubmit = (e) => {
    e.preventDefault();
    const registerUserData = new FormData(registerUserRef.current);
    registeruser(registerUserData);
    console.log(registerUserData);
    registerUserRef.current.reset();
  };

  const handleEdit = (id) => {
    setSelectedUserId(id);
    setEditUserModal(true);
  };

  const { mutate: deleteUser } = useMutation({
    mutationFn: deleteUserAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["list-of-user"]);
      console.log("User deleted and list refreshed");
    },
  });

  const handleDeleteModal = (id) => {
    setDeleteUserModal(true);
    setDeleteUserId(id);
  };

  const handleDelete = (id) => {
    setDeleteUserModal(false);
    deleteUser(id);
  };

  return (
    <main className="w-full">
      {/* Trigger Button */}
      <label
        htmlFor="modal-toggle"
        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Personnel
      </label>

      {/* Hidden Checkbox */}
      <input type="checkbox" id="modal-toggle" className="peer hidden" />

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 peer-checked:flex hidden">
        {/* Modal Box */}
        <form
          ref={registerUserRef}
          onSubmit={registerUserSubmit}
          className="bg-white p-6 rounded-xl shadow-xl relative w-96"
          action=""
        >
          <h2 className="text-xl font-bold mb-4">Add Personnel</h2>
          <p>Enter email.</p>
          <input className="border-1" name="email" type="email" />

          {showError && <p className="text-red-500">{showError}</p>}

          <button
            type="submit"
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-white ${
              isRegistering ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
            }`}
            disabled={isRegistering}
          >
            {isRegistering && (
              <div className="relative size-4">
                <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              </div>
            )}
            {isRegistering ? "Registering..." : "Submit"}
          </button>

          {/* Close Button */}
          <label
            htmlFor="modal-toggle"
            className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl cursor-pointer"
          >
            &times;
          </label>
        </form>
      </div>

      <div className="overflow-y-auto rounded-2xl border border-gray-200 shadow-sm">
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl flex items-center space-x-4">
              <div className="relative inline-block size-4">
                <div className="absolute inset-0 rounded-full border-3 border-blue-200"></div>

                <div className="absolute inset-0 animate-spin rounded-full border-3 border-gray-4y00 border-t-transparent"></div>
              </div>

              <span className="text-lg font-medium">Loading users...</span>
            </div>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Birth Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {userList.map((obj) => (
              <tr key={obj.id}>
                <td className="text-center py-5 text-gray-500">
                  {obj.employee_id}
                </td>
                <td className="text-center py-5 text-gray-500">
                  {obj.first_name} {obj.middle_name} {obj.last_name}
                </td>
                <td className="text-center py-5 text-gray-500">{obj.email}</td>
                <td className="text-center py-5 text-gray-500">
                  {obj.birth_date}
                </td>
                <td className="text-center py-5">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleEdit(obj.id)}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteModal(obj.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editUserModal && (
        <div className="absolute w-screen h-screen bg-black/50 top-0 left-0 flex flex-col justify-center items-center z-50">
          <div className="w-auto bg-white w-[1000px] rounded-md flex flex-col gap-4 relative">
            <label
              htmlFor="modal-toggle"
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl cursor-pointer"
              onClick={() => setEditUserModal(false)}
            >
              &times;
            </label>

            <div className="overflow-y-auto">
              {/* Pass selectedUserId to a component that renders user data */}
              <EditUserPage
                userId={selectedUserId}
                userModal={setEditUserModal}
                editModal={setEditUserModal}
              />
            </div>
          </div>
        </div>
      )}

      {deleteUserModal && (
        <div className="absolute w-screen h-screen bg-black/50 top-0 left-0 flex flex-col justify-center items-center">
          <div className=" w-[300px] bg-white h-auto rounded-md flex gap-4 flex-col">
            <div className="p-3 border-b-1 border-gray-500">
              <h1 className="text-xl">Action</h1>
            </div>
            <div className="p-3">
              <p>Are you sure you want to delete this Personnel?</p>
            </div>

            <div className="flex p-3 flex-row-reverse border-t-1 border-gray-500 gap-4">
              <button
                onClick={() => {
                  setDeleteUserModal(false);
                }}
                className="p-2 rounded-md bg-gray-500 text-white"
              >
                Cancel
              </button>

              {deleteUserId && (
                <button
                  onClick={() => {
                    handleDelete(deleteUserId);
                  }}
                  className="p-2 rounded-md bg-red-500 text-white"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
