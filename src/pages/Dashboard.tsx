import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Consultation {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
}

const mockConsultations: Consultation[] = [
  {
    id: "1",
    title: "Consultation Marketing Digital",
    description: "Analyse de la stratégie marketing digitale",
    date: "2024-03-20",
    status: "completed",
  },
  {
    id: "2",
    title: "Audit Financier",
    description: "Révision des comptes annuels",
    date: "2024-03-21",
    status: "in_progress",
  },
  {
    id: "3",
    title: "Formation RH",
    description: "Formation sur les nouvelles procédures RH",
    date: "2024-03-22",
    status: "pending",
  },
  {
    id: "4",
    title: "Consultation IT",
    description: "Mise à jour des systèmes informatiques",
    date: "2024-03-23",
    status: "cancelled",
  },
];

const ITEMS_PER_PAGE = 5;

const Badge = ({ status }: { status: Consultation["status"] }) => {
  const getStatusColor = (status: Consultation["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: Consultation["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

const DropdownMenu = ({
  children,
  trigger,
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default function DashboardAdmin() {
  const { user, logout } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<
    string | null
  >(null);

  if (user?.id !== userId) {
    return <Navigate to={`/${user?.id}/dashboard/`} replace />;
  }

  const filteredConsultations = mockConsultations.filter(
    (consultation) =>
      consultation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredConsultations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedConsultations = filteredConsultations.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleDeleteConsultation = (id: string) => {
    setSelectedConsultation(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    console.log(`Consultation with id ${selectedConsultation} deleted`);
    // Remove from the list (mock)
    mockConsultations.splice(
      mockConsultations.findIndex(
        (consultation) => consultation.id === selectedConsultation
      ),
      1
    );
    setShowModal(false);
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  const handleViewDetails = (
    consultation: Consultation,
    action: "chat" | "contract"
  ) => {
    if (action === "chat") {
      navigate(`/chat/${consultation.id}`);
    } else {
      navigate(`/contract/${consultation.id}`);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <h2 className="text-lg font-semibold">ISDBI Admin</h2>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={logout}>
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Total Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockConsultations.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  mockConsultations.filter((c) => c.status === "in_progress")
                    .length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  mockConsultations.filter((c) => c.status === "completed")
                    .length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockConsultations.filter((c) => c.status === "pending").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Consultations</CardTitle>
            <CardDescription>
              List of consultations with their status
            </CardDescription>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search consultation..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedConsultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell className="font-medium">
                      {consultation.title}
                    </TableCell>
                    <TableCell>{consultation.description}</TableCell>
                    <TableCell>
                      {new Date(consultation.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge status={consultation.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu
                        trigger={
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      >
                        <div className="py-1">
                          <div className="px-4 py-2 text-sm font-medium">
                            Actions
                          </div>
                          <div className="border-t border-gray-100"></div>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() =>
                              handleViewDetails(consultation, "chat")
                            }
                          >
                            Chat
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() =>
                              handleViewDetails(consultation, "contract")
                            }
                          >
                            Contract
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                            onClick={() =>
                              handleDeleteConsultation(consultation.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
      </main>

      {/* Modal for confirmation of deletion */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this consultation?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
