"use client";

import { Button } from "@/components/ui/button";
import { formatDateAndTime } from "@/constants/default";
import {
  publishConversation,
  unPublishConversation,
} from "@/lib/helper/edgedb/getCategoryList";
import getUserDebates from "@/lib/helper/edgedb/myDebates";
import { setDebatesState, topicListState } from "@/state/state";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useToast } from "@/components/ui/use-toast";
import { EyeIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import SuccessToast from "@/components/successToast";
import { SpinnerIcon, UnPublishIcon } from "@/components/svg";
import Loading from "@/components/loading";
import { motion, AnimatePresence } from "framer-motion";
import { TagIcon } from "lucide-react";
import ReusablePlaceholder from "../reusablePlaceholder";
import EditModal from "../editModal";

const MyDebateContainer = () => {
  const { data: session, status } = useSession();
  const [filter, setFilter] = useState("all");
  const [debates, setDebates] = useRecoilState<any[]>(setDebatesState);
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const setTopics = useSetRecoilState<any>(topicListState);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");
  const [conversationId, setConversationID] = useState("");

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setCurrentCategory("");
    setCurrentTitle("");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        const data = await getUserDebates(session.user.id);
        const formattedList = data.map((debate: any) => ({
          title: debate.topic,
          dateAdded: new Date(debate.created_at).toLocaleDateString(),
          id: debate.conversation_id,
          time: new Date(debate.created_at).toLocaleTimeString(),
          imageUrl: debate.imageURL,
          published: debate.published,
          category: debate.category,
        }));
        setDebates(formattedList);
      }
    };
    fetchData();
  }, [session]);

  const handlePublish = async (id: string) => {
    try {
      setLoadingStates((prevStates) => ({ ...prevStates, [id]: true }));
      const updatedDebate = await publishConversation(id);
      if (updatedDebate && updatedDebate.length > 0) {
        const newTopics = updatedDebate.map((debate) => debate.topic);

        setDebates((prevDebates) =>
          prevDebates.map((debate) =>
            debate.id === id ? { ...debate, published: true } : debate
          )
        );

        setTopics((prevTopics: any) => {
          const uniqueNewTopics = newTopics.filter(
            (topic) => !prevTopics.includes(topic)
          );
          return [...prevTopics, ...uniqueNewTopics];
        });
        setLoadingStates((prevStates) => ({ ...prevStates, [id]: false }));

        toast({
          className: "toastClass",
          action: (
            <div className="px-5">
              <SuccessToast
                title="Successfully published!"
                description="Your debate is now visible to other users."
                className="text-green-800 border-green-300 bg-green-100"
              />
            </div>
          ),
        });
      }
    } catch (error) {
      setLoadingStates((prevStates) => ({ ...prevStates, [id]: false }));
      toast({
        className: "toastClass",
        action: (
          <div className="px-5">
            <SuccessToast
              title="Failed publish!"
              description="There was an error publishing your debate. Please try again."
              className="text-green-800 border-green-300 bg-green-100"
            />
          </div>
        ),
      });
    }
  };

  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });

  const handleUnPublish = async (id: string) => {
    try {
      setLoadingStates((prevStates) => ({ ...prevStates, [id]: true }));
      const updatedDebate = await unPublishConversation(id);
      if (updatedDebate && updatedDebate.length > 0) {
        const removedTopics = updatedDebate.map((debate) => debate.topic);

        setDebates((prevDebates) =>
          prevDebates.map((debate) =>
            debate.id === id ? { ...debate, published: false } : debate
          )
        );

        setTopics((prevTopics: any) =>
          prevTopics.filter((topic: any) => !removedTopics.includes(topic))
        );
        setLoadingStates((prevStates) => ({ ...prevStates, [id]: false }));
        toast({
          className: "toastClass",
          action: (
            <div className="px-5">
              <SuccessToast
                title="Successfully Unpublished!"
                description="Your debate is now visible to only you."
                className="text-green-800 border-green-300 bg-green-100"
              />
            </div>
          ),
        });
      }
    } catch (error) {
      setLoadingStates((prevStates) => ({ ...prevStates, [id]: false }));
      toast({
        className: "toastClass",
        action: (
          <div className="px-5">
            <SuccessToast
              title="Failed Unpublish!"
              description="There was an error Unpublishing your debate. Please try again."
              className="text-red-800 border-red-300 bg-red-50"
            />
          </div>
        ),
      });
    }
  };

  const handleEditSuccess = (updatedDebate: any) => {
    if (updatedDebate?.id) {
      setDebates((prevDebates) =>
        prevDebates.map((debate) =>
          debate.id === updatedDebate.id ? updatedDebate : debate
        )
      );
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return (
      <ReusablePlaceholder
        desctiption="You must be logged in to view this section, ensuring secure
              access for authenticated users only"
        src="/user-login.json"
        text="You must be logged in to view this section"
        content={<Button onClick={() => signIn()}>Login</Button>}
      />
    );
  }

  const filterOptions = [
    { name: "all", label: "All" },
    { name: "published", label: "Published" },
    { name: "unpublished", label: "Unpublished" },
  ];

  const filteredDebates = debates.filter((debate) => {
    if (filter === "all") return true;
    if (filter === "published") return debate.published;
    if (filter === "unpublished") return !debate.published;
  });

  return (
    <>
      <div className="px-5 py-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold">Top Debates</h1>
          <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-pink-600">
            Exclusively customized for you
          </p>
        </div>
        {filteredDebates.length > 0 && (
          <div className="flex justify-center mb-4">
            <a href="/debate">
              <Button className="max-w-fit flex gap-2 py-3">
                Start new debate
              </Button>
            </a>
          </div>
        )}

        {filteredDebates.length > 0 && (
          <div className="flex sm:flex-row flex-col gap-y-5 justify-between items-center py-4">
            <span>
              <strong>Note:</strong> If you publish, it will be visible to
              others.
            </span>
            <div className="flex justify-center mb-4 pt-4">
              <motion.div className="flex space-x-4">
                {filterOptions.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setFilter(option.name)}
                    className={`px-4 py-1.5 rounded-lg ${
                      filter === option.name
                        ? "bg-slate-900 font-semibold text-white"
                        : "bg-white border font-semibold border-slate-900"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    layout
                  >
                    {option.label}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </div>
        )}
        <div>
          {filteredDebates.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 py-5 lg:grid-cols-3 gap-4"
              >
                {filteredDebates.map((debate, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    key={index}
                  >
                    <div className="row-span-1 rounded-xl h-full group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none dark:bg-black dark:border-white/[0.2] bg-white border border-gray-300 gap-2 p-4 flex flex-col space-y-4 relative">
                      <Image
                        src={debate.imageUrl}
                        alt="debate image"
                        width={200}
                        height={200}
                        className="w-full aspect-square h-44 object-cover rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 "
                      />
                      <PencilSquareIcon
                        onClick={() => {
                          toggleModal();
                          setConversationID(debate.id);
                          setCurrentTitle(debate.title);
                          setCurrentCategory(debate.category);
                        }}
                        className="w-5 h-5 absolute top-3 right-6 cursor-pointer bg-slate-800 m-2 text-white rounded-md"
                      />
                      <div className="group-hover/bento:translate-x-2 space-y-2 transition duration-200">
                        <Link
                          href={`/chat/${debate.id}`}
                          className="font-sans line-clamp-2 md:line-clamp-1 max-w-fit hover:text-blue-600 font-bold text-neutral-600 dark:text-neutral-200"
                        >
                          {debate.title.charAt(0).toUpperCase() +
                            debate.title.slice(1)}
                        </Link>
                        <p className="text-sm text-gray-500">
                          Added: {formatDateAndTime(debate.dateAdded)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Published: {debate.published ? "Yes" : "No"}
                        </p>
                        <div className="flex justify-between items-center w-full">
                          <div className="flex gap-2 items-center">
                            <TagIcon className="w-5 h-5 text-gray-500" />{" "}
                            <span className="text-gray-500">
                              {debate.category}
                            </span>
                          </div>
                          {debate.published ? (
                            <div className="flex justify-end">
                              <Button
                                onClick={() => handleUnPublish(debate.id)}
                                disabled={loadingStates[debate.id]}
                                className="mt-2 text-white flex items-center cursor-pointer space-x-1 hover:bg-slate-700"
                              >
                                <span className="flex gap-1">
                                  <span className="text-sm">
                                    {loadingStates[debate.id] ? (
                                      <span className="flex items-center space-x-1">
                                        <SpinnerIcon className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" />
                                        Wait...
                                      </span>
                                    ) : (
                                      <span className="flex gap-1 items-center space-x-1">
                                        <UnPublishIcon className="h-5 w-5 text-white" />
                                        Unpublish
                                      </span>
                                    )}
                                  </span>
                                </span>
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <Button
                                onClick={() => handlePublish(debate.id)}
                                disabled={loadingStates[debate.id]}
                                className="mt-2 text-white flex items-center cursor-pointer space-x-1 hover:bg-slate-700"
                              >
                                <span className="flex gap-1">
                                  <span className="text-sm">
                                    {loadingStates[debate.id] ? (
                                      <span className="flex items-center space-x-1">
                                        <SpinnerIcon className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" />
                                        Wait...
                                      </span>
                                    ) : (
                                      <span className="flex gap-1 items-center space-x-1">
                                        <EyeIcon className="h-5 w-5 text-white" />
                                        Publish
                                      </span>
                                    )}
                                  </span>
                                </span>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <ReusablePlaceholder
              desctiption="No debates found. Please check back later or start a new debate to engage in discussions on various topics."
              src="/not-found.json"
              text="No debates found"
              content={
                <div className="flex justify-center mb-4">
                  <a href="/debate">
                    <Button className="max-w-fit flex gap-2 py-3">
                      Start new debate
                    </Button>
                  </a>
                </div>
              }
            />
          )}
        </div>
        <EditModal
          isOpen={isOpen}
          toggleModal={toggleModal}
          conversationId={conversationId}
          currentTitle={currentTitle}
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
          setCurrentTitle={setCurrentTitle}
          onEditSuccess={handleEditSuccess} // Pass the callback here
        />
      </div>
    </>
  );
};

export default MyDebateContainer;
