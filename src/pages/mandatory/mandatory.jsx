import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createMandatoryAPI,
  getMandatoryAPI,
  updateMandatoryAPI,
} from "../../api/mandatoryAPI";
import { UserListIdAPI } from "../../api/userAPI";
import { useRef, useState } from "react";

export default function MandatoryModal({ userId }) {
  const id = userId;
  const formRef = useRef();
  const [successModal, setSuccessModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState([]);

  // Get user info
  const { data: user } = useQuery({
    queryKey: ["user-detail", id],
    queryFn: ({ queryKey }) => {
      const [, idUser] = queryKey;
      return UserListIdAPI(idUser);
    },
    enabled: !!id,
  });

  // Get mandatory data
  const { data: mandatoryData } = useQuery({
    queryKey: ["mandatory-data", id],
    queryFn: async () => {
      const allMandatory = await getMandatoryAPI();
      return allMandatory.find((entry) => entry.user.id === id) || null;
    },
    enabled: !!id,
  });

  const { mutate: createMandatory } = useMutation({
    mutationFn: createMandatoryAPI,
    onSuccess: (data) => {
      console.log("Succesfuly Create Mandatory", data);
      setSuccessModal(true);
      console.log("ID", id);
      setShowSuccess("Successfully created personnel mandatory.");
    },
    onError: (error) => {
      console.error("Error Create", error);
    },
  });

  const { mutate: updateMandatory } = useMutation({
    mutationFn: updateMandatoryAPI,
    onSuccess: (data) => {
      console.log("Succesfuly Updata Mandatory", data);
      setSuccessModal(true);
      setShowSuccess("Successfully updated personnel mandatory.");
    },
    onError: (error) => {
      console.error("Error Update", error);
    },
  });

  const mandatorySubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    const data = {
      user: formData.get("user"),
      sss_contrib: parseFloat(formData.get("sss_contrib")) || 0,
      pagibig_contrib: parseFloat(formData.get("pagibig_contrib")) || 0,
      philhealth_contrib: parseFloat(formData.get("philhealth_contrib")) || 0,
      tax: parseFloat(formData.get("tax")) || 0,
    };

    if (mandatoryData?.id) {
      updateMandatory({ id: mandatoryData.id, data });
    } else {
      createMandatory(data);
    }
  };

  const closeModal = () => {
    setSuccessModal(false);
  };

  return (
    <div>
      <div className="p-4">
        <h2 className="text-xl font-bold w-full">Edit User</h2>

        <form
          ref={formRef}
          onSubmit={mandatorySubmit}
          className="flex flex-wrap gap-4 w-[1000px] bg-red-500"
        >
          {/* Left column */}
          <div className="flex-1 min-w-[300px] space-y-4">
            <div>
              <input
                name="user"
                type="text"
                step="any"
                defaultValue={user?.id}
                className="border p-2 rounded w-full hidden"
              />
            </div>
            <div>
              <label>SSS Contribution</label>
              <input
                name="sss_contrib"
                type="number"
                step="any"
                defaultValue={mandatoryData?.sss_contrib || ""}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label>Pagibig Contribution</label>
              <input
                name="pagibig_contrib"
                type="number"
                step="any"
                defaultValue={mandatoryData?.pagibig_contrib || ""}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label>Phil Health Contribution</label>
              <input
                name="philhealth_contrib"
                type="number"
                step="any"
                defaultValue={mandatoryData?.philhealth_contrib || ""}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label>Tax</label>
              <input
                name="tax"
                type="number"
                step="any"
                defaultValue={mandatoryData?.tax || ""}
                className="border p-2 rounded w-full"
              />
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
      </div>

      {successModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="w-[300px] bg-white rounded-md shadow-lg">
            <div className="p-4 border-b border-gray-300">
              <h1 className="text-xl font-semibold">Status</h1>
            </div>
            <div className="p-4">
              {showSuccess && <p className="text-green-600">{showSuccess}</p>}
              {/* {showError && <p className="text-red-600">{showError}</p>} */}
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
