import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Edit2, Save, Download } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: string;
  sectionId: string;
}

interface ConsultationDetails {
  id: string;
  title: string;
  summary: string;
  source: string;
  status: string;
}

interface Section {
  id: string;
  title: string;
  content: string;
  isApproved: boolean;
  messages: Message[];
  finalContent?: string;
}

interface Chapter {
  id: string;
  title: string;
  sections: Section[];
  isApproved: boolean;
}

interface ConsultantResponse {
  title: string;
  response: string;
  summary: string;
  source: string;
}

// Test data
const mockConsultation: ConsultationDetails = {
  id: "1",
  title: "Consultation Marketing Digital",
  summary:
    "Analyse approfondie de la stratégie marketing digitale pour améliorer la présence en ligne",
  source: "Demande client via formulaire web",
  status: "in_progress",
};

const mockChapters: Chapter[] = [
  {
    id: "1",
    title: "Introduction",
    isApproved: false,
    sections: [
      {
        id: "1-1",
        title: "Contexte",
        content: "Le contexte de la consultation marketing digital...",
        isApproved: false,
        messages: [],
      },
      {
        id: "1-2",
        title: "Objectifs",
        content: "Les objectifs principaux de cette consultation...",
        isApproved: false,
        messages: [],
      },
    ],
  },
  {
    id: "2",
    title: "Analyse de la Situation Actuelle",
    isApproved: false,
    sections: [
      {
        id: "2-1",
        title: "Analyse SWOT",
        content: "Forces, faiblesses, opportunités et menaces...",
        isApproved: false,
        messages: [],
      },
      {
        id: "2-2",
        title: "Analyse Concurrentielle",
        content: "Étude des concurrents directs et indirects...",
        isApproved: false,
        messages: [],
      },
    ],
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    content:
      "Bonjour, je souhaite une analyse de ma stratégie marketing digitale.",
    sender: "user",
    timestamp: "2024-03-20T10:00:00",
    sectionId: "1-1",
  },
  {
    id: "2",
    content:
      "Bonjour, je suis ravi de vous aider avec votre stratégie marketing digitale. Pouvez-vous me donner plus de détails sur vos objectifs actuels ?",
    sender: "assistant",
    timestamp: "2024-03-20T10:01:00",
    sectionId: "1-2",
  },
];

// Modifier la fonction callAgentAPI
const callAgentAPI = async (query: string): Promise<ConsultantResponse> => {
  try {
    const response = await fetch(
      "https://multi-agents-coordination.onrender.com/v1/consultant",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de l'appel à l'API");
    }

    const data = await response.json();
    return data as ConsultantResponse;
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
};

export default function ChatPage() {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [consultationDetails, setConsultationDetails] =
    useState<ConsultationDetails>(mockConsultation);
  const [chapters, setChapters] = useState<Chapter[]>(
    mockChapters.map((chapter) => ({
      ...chapter,
      sections: chapter.sections.map((section) => ({
        ...section,
        messages: [],
      })),
    }))
  );
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showContract, setShowContract] = useState(true);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedSection) {
      setIsLoading(true);
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: "user",
        timestamp: new Date().toISOString(),
        sectionId: selectedSection.id,
      };

      // Mettre à jour les messages de la section
      setChapters((prev) =>
        prev.map((chapter) => {
          if (chapter.id === selectedChapter?.id) {
            return {
              ...chapter,
              sections: chapter.sections.map((section) => {
                if (section.id === selectedSection.id) {
                  const updatedMessages = [
                    ...(section.messages || []),
                    message,
                  ];
                  return {
                    ...section,
                    messages: updatedMessages,
                  };
                }
                return section;
              }),
            };
          }
          return chapter;
        })
      );

      // Mettre à jour la section sélectionnée avec le nouveau message
      setSelectedSection((prev) => {
        if (prev) {
          return {
            ...prev,
            messages: [...(prev.messages || []), message],
          };
        }
        return prev;
      });

      setNewMessage("");

      // Appeler l'API de l'agent
      try {
        const agentResponse = await callAgentAPI(newMessage);

        // Mettre à jour les détails de la consultation
        setConsultationDetails((prev) => ({
          ...prev,
          title: agentResponse.title,
          summary: agentResponse.summary,
          source: agentResponse.source,
        }));

        const response: Message = {
          id: (Date.now() + 1).toString(),
          content: agentResponse.response,
          sender: "assistant",
          timestamp: new Date().toISOString(),
          sectionId: selectedSection.id,
        };

        // Mettre à jour les messages de la section avec la réponse
        setChapters((prev) =>
          prev.map((chapter) => {
            if (chapter.id === selectedChapter?.id) {
              return {
                ...chapter,
                sections: chapter.sections.map((section) => {
                  if (section.id === selectedSection.id) {
                    const updatedMessages = [
                      ...(section.messages || []),
                      response,
                    ];
                    return {
                      ...section,
                      messages: updatedMessages,
                    };
                  }
                  return section;
                }),
              };
            }
            return chapter;
          })
        );

        // Mettre à jour la section sélectionnée avec la réponse
        setSelectedSection((prev) => {
          if (prev) {
            return {
              ...prev,
              messages: [...(prev.messages || []), response],
            };
          }
          return prev;
        });
      } catch (error) {
        console.error("Erreur lors de l'appel à l'agent:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            "Désolé, une erreur s'est produite lors de la communication avec l'agent.",
          sender: "assistant",
          timestamp: new Date().toISOString(),
          sectionId: selectedSection.id,
        };

        // Mettre à jour avec le message d'erreur
        setChapters((prev) =>
          prev.map((chapter) => {
            if (chapter.id === selectedChapter?.id) {
              return {
                ...chapter,
                sections: chapter.sections.map((section) => {
                  if (section.id === selectedSection.id) {
                    return {
                      ...section,
                      messages: [...(section.messages || []), errorMessage],
                    };
                  }
                  return section;
                }),
              };
            }
            return chapter;
          })
        );

        setSelectedSection((prev) => {
          if (prev) {
            return {
              ...prev,
              messages: [...(prev.messages || []), errorMessage],
            };
          }
          return prev;
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setSelectedSection(null);
  };

  const handleSectionSelect = (section: Section) => {
    // Créer un message initial
    const initialMessage: Message = {
      id: Date.now().toString(),
      content: `Bonjour, je souhaite discuter de la section "${section.title}". Pouvez-vous m'aider à la finaliser ?`,
      sender: "user",
      timestamp: new Date().toISOString(),
      sectionId: section.id,
    };

    // Créer une réponse initiale
    const initialResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: `Bien sûr ! Je suis là pour vous aider avec la section "${section.title}". Voici le contenu actuel :\n\n${section.content}\n\nQue souhaitez-vous modifier ou ajouter ?`,
      sender: "assistant",
      timestamp: new Date().toISOString(),
      sectionId: section.id,
    };

    // Mettre à jour les messages de la section
    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.sections.some((s) => s.id === section.id)) {
          return {
            ...chapter,
            sections: chapter.sections.map((s) => {
              if (s.id === section.id) {
                return {
                  ...s,
                  messages: [initialMessage, initialResponse],
                };
              }
              return s;
            }),
          };
        }
        return chapter;
      })
    );

    setSelectedSection(section);
    setSelectedChapter(
      chapters.find((chapter) =>
        chapter.sections.some((s) => s.id === section.id)
      ) || null
    );
  };

  const handleApproveSection = () => {
    if (selectedChapter && selectedSection) {
      // Trouver la dernière réponse de l'assistant
      const lastAssistantMessage = selectedSection.messages
        .filter((msg) => msg.sender === "assistant")
        .pop();

      setChapters((prev) =>
        prev.map((chapter) => {
          if (chapter.id === selectedChapter.id) {
            const updatedSections = chapter.sections.map((section) => {
              if (section.id === selectedSection.id) {
                return {
                  ...section,
                  isApproved: true,
                  finalContent:
                    lastAssistantMessage?.content || section.content,
                };
              }
              return section;
            });

            const allSectionsApproved = updatedSections.every(
              (section) => section.isApproved
            );

            return {
              ...chapter,
              sections: updatedSections,
              isApproved: allSectionsApproved,
            };
          }
          return chapter;
        })
      );
    }
  };

  const generateContractFile = () => {
    const approvedChapters = chapters.filter((chapter) => chapter.isApproved);
    const contractContent = approvedChapters
      .map((chapter) => {
        const chapterContent = chapter.sections
          .filter((section) => section.isApproved)
          .map(
            (section) =>
              `${section.title}\n${section.finalContent || section.content}`
          )
          .join("\n\n");
        return `${chapter.title}\n\n${chapterContent}`;
      })
      .join("\n\n---\n\n");

    const blob = new Blob([contractContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contract.txt";
    link.click();
  };

  // Vérifier si tous les chapitres sont approuvés
  const areAllChaptersApproved = () => {
    return chapters.every((chapter) => chapter.isApproved);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 dark:bg-gray-800">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        onClick={() => setShowSidebar(!showSidebar)}
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-900 border-r p-4 md:p-6 flex flex-col shadow-lg transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Consultation Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-300">Title</h3>
                <p className="text-sm">{consultationDetails.title}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-300">Summary</h3>
                <p className="text-sm">{consultationDetails.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-300">Source</h3>
                <p className="text-sm">{consultationDetails.source}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chapters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleChapterSelect(chapter)}
                >
                  <h3 className="font-semibold mb-2">{chapter.title}</h3>
                  <div className="space-y-2">
                    {chapter.sections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSectionSelect(section);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          {section.isApproved ? (
                            <span className="text-green-500">✓</span>
                          ) : (
                            <span className="w-4"></span>
                          )}
                          <span>{section.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedSection ? (
          <div className="flex-1 flex flex-col bg-white p-4 shadow-lg dark:bg-gray-800">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {selectedSection.messages &&
                selectedSection.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[70%] p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 dark:text-white"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-white dark:bg-gray-900">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 rounded-lg"
                  disabled={isLoading}
                />
                {!selectedSection.isApproved && (
                  <Button
                    onClick={handleApproveSection}
                    className="bg-green-500 text-white rounded-full p-3 hover:bg-green-600 transition-colors"
                    disabled={isLoading}
                  >
                    ✓ Approve
                  </Button>
                )}
                <Button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-colors"
                  disabled={isLoading}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              Select a section to start the discussion
            </p>
          </div>
        )}
      </div>

      {/* Contract Panel */}
      <div
        className={`${
          showContract ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 right-0 z-40 w-80 md:w-96 bg-white dark:bg-gray-900 border-l p-4 md:p-6 flex flex-col shadow-lg transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Contract Generation</h2>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setShowContract(false)}
            aria-label="Close contract panel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-4">
            {chapters
              .filter((chapter) => chapter.isApproved)
              .map((chapter) => (
                <div
                  key={chapter.id}
                  className="border p-4 rounded-lg shadow-md bg-gray-50 dark:bg-gray-700"
                >
                  <h3 className="text-xl font-bold mb-4">{chapter.title}</h3>
                  {chapter.sections
                    .filter((section) => section.isApproved)
                    .map((section) => (
                      <div key={section.id} className="mb-4">
                        <h4 className="text-lg font-semibold mb-2">
                          {section.title}
                        </h4>
                        <p className="whitespace-pre-wrap break-words">
                          {section.finalContent || section.content}
                        </p>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>

        {/* Download Contract Button */}
        {areAllChaptersApproved() && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={generateContractFile}
              className="bg-green-500 text-white rounded-full p-3 hover:bg-green-600 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Final Contract
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Contract Button */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
        onClick={() => setShowContract(!showContract)}
        aria-label="Toggle contract panel"
      >
        <Download className="h-6 w-6" />
      </button>
    </div>
  );
}
