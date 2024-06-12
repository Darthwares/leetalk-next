import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { allCategories } from "@/constants/default";
import { AuthenticationModalProps } from "@/types/types";
import { updateDebate } from "@/lib/helper/edgedb/setConversations";
import { useRouter } from "next/navigation";

interface EditModalProps extends AuthenticationModalProps {
  onEditSuccess: (updatedDebate: any) => void; // Add the prop here
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  toggleModal,
  conversationId,
  currentTitle,
  currentCategory,
  setCurrentCategory,
  setCurrentTitle,
  onEditSuccess, // Destructure the prop here
}) => {
  const [title, setTitle] = useState(currentTitle);
  const [category, setCategory] = useState(currentCategory);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTitle(currentTitle);
    setCategory(currentCategory);
  }, [currentTitle, currentCategory]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if there are any changes
    if (title === currentTitle && category === currentCategory && !image) {
      toggleModal();
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = null;

      if (image) {
        const formData = new FormData(e.currentTarget);
        const file = formData.get("image") as File;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const base64data = reader.result?.toString().split(",")[1];

          const response = await fetch("/api/updateDebate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileName: file.name, file: base64data }),
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.message || "Image upload failed");
          }
          imageUrl = result.url;
          const updatedDebate = await updateDebate(
            conversationId,
            title || undefined,
            category || undefined,
            imageUrl || undefined
          );

          onEditSuccess(updatedDebate);

          setIsLoading(false);
          router.push(`/chat/${conversationId}`);
          toggleModal();
        };
      } else {
        const updatedDebate = await updateDebate(
          conversationId,
          title || undefined,
          category || undefined,
          imageUrl || undefined
        );

        // Call the onEditSuccess callback with the updated debate data
        onEditSuccess(updatedDebate);

        setCurrentCategory("");
        setCurrentTitle("");
        setIsLoading(false);
        router.push(`/chat/${conversationId}`);
        toggleModal();
      }
    } catch (err) {
      console.error("Failed to update conversation:", err);
      setError("Failed to update conversation. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[52]"
        onClose={() => {
          setCurrentCategory("");
          setCurrentTitle("");
          toggleModal();
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-bold pb-4 line-clamp-2">
                    {currentTitle}
                  </h2>
                  <div className="mb-4 space-y-3">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4 space-y-3">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <Textarea
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4 space-y-3">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                      className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                  </div>
                  <div
                    className={`mt-5 sm:mt-6 w-full flex ${
                      isLoading ? "justify-between" : "justify-end"
                    }`}
                  >
                    {isLoading && (
                      <p className="flex items-center">
                        <svg
                          aria-hidden="true"
                          className="animate-spin h-5 w-5 mr-3 text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <>saving...</>
                      </p>
                    )}
                    <Button type="submit" disabled={isLoading}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditModal;
