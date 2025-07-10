import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGenderAPI, updateUserAPI, UserListIdAPI } from "../../api/userAPI";

export default function EditUserPage({ userId }) {
  const id = userId;
  // const [user, setUser] = useState(null);
  const userInfoRef = useRef(null);
  const [successModal, setSuccessModal] = useState(false);
  const [showError, setShowError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);
  const queryClient = useQueryClient();
  const { data: gender } = useQuery({
    queryKey: ["gender-list"],
    queryFn: () => getGenderAPI(),
  });

  const { data: user } = useQuery({
    queryKey: ["user-detail", id], // Pass the ID here
    queryFn: ({ queryKey }) => {
      const [, idUser] = queryKey;
      return UserListIdAPI(idUser); // Pass ID directly
    },
  });

  const { mutate: updateUser } = useMutation({
    mutationFn: ({ id, formData }) => updateUserAPI(id, formData),
    onSuccess: (data) => {
      console.log("User updated successfully", data);
      setSuccessModal(true);
      setShowSuccess("Success!");
      queryClient.invalidateQueries(["list-of-user"]);
   
      
    },
    onError: (error) => {
      console.log("error", error.employee_id);
      setSuccessModal(true);
      setShowError(error.employee_id);
      setShowError(error.Array[0]);

    },
  });

  const updateUserSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(userInfoRef.current);
    updateUser({ id, formData }); // ✅ pass id and formData together
  };

  if (!user) return <p>Loadings...</p>;

  const closeModal = () => {
    setSuccessModal(false);
    setShowSuccess(""); // or null, depending on your default
    setShowError("");
  };
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold w-full">Edit User</h2>

      <form
        ref={userInfoRef}
        onSubmit={updateUserSubmit}
        className="flex flex-wrap gap-4 w-[1000px] bg-red-500"
      >
        {/* Left column */}
        <div className="flex-1 min-w-[300px] space-y-4">
          <div>
            <label>First Name</label>
            <input
              name="first_name"
              type="text"
              defaultValue={user.first_name}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Middle Name</label>
            <input
              name="middle_name"
              type="text"
              defaultValue={user.middle_name}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              name="last_name"
              type="text"
              defaultValue={user.last_name}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Employee ID</label>
            <input
              name="employee_id"
              type="text"
              defaultValue={user.employee_id}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 min-w-[300px] space-y-4">
          <div>
            <label>User Name</label>
            <input
              name="username"
              type="text"
              defaultValue={user.username}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Email</label>
            <input
              name="email"
              type="text"
              defaultValue={user.email}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Birth Date</label>
            <input
              name="birth_date"
              type="date"
              defaultValue={user.birth_date}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label>Gender</label>
            <select
              name="gender"
              defaultValue={user.gender}
              className="border p-2 rounded w-full"
            >
              {gender?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit button full width below */}
        <div className="w-full">
          <input
            type="submit"
            value="Submit"
            className="border bg-blue-500 text-white p-2 rounded w-full"
          />
        </div>
      </form>

      {successModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="w-[300px] bg-white rounded-md shadow-lg">
            <div className="p-4 border-b border-gray-300">
              <h1 className="text-xl font-semibold">Status</h1>
            </div>
            <div className="p-4">
              {showSuccess && <p className="text-green-600">{showSuccess}</p>}
              {showError && <p className="text-red-600">{showError}</p>}
            </div>
            <div className="flex justify-end p-4 border-t border-gray-300">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
