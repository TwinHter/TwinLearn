import { Button } from "../components/ui/button";
import { Book, CheckSquare, Cpu, Info } from "lucide-react";

interface NavigationProps {
    currentPage: string;
    setCurrentPage: (page: any) => void;
    onToggleSidebar: () => void;
}

export default function Navigation({
    currentPage,
    setCurrentPage,
    onToggleSidebar,
}: NavigationProps) {
    const navItems = [
        { id: "introduction", label: "Giới thiệu", icon: Info },
        { id: "checklist", label: "Checklist", icon: CheckSquare },
        { id: "problems", label: "Bài tập", icon: Book },
        { id: "ai-helper", label: "AI Helper", icon: Cpu },
    ];

    return (
        <aside className="w-64 h-screen bg-white/80 backdrop-blur-lg border-r border-slate-200 shadow-md flex flex-col justify-between">
            <div className="flex flex-col gap-2 p-4">
                {navItems.map(({ id, label, icon: Icon }) => {
                    const isActive = currentPage === id;
                    return (
                        <Button
                            key={id}
                            onClick={() => setCurrentPage(id as any)}
                            variant="ghost"
                            className={`flex items-center justify-start gap-3 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium
                                ${
                                    isActive
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }
                            `}
                        >
                            <Icon
                                className={`w-4 h-4 ${
                                    isActive
                                        ? "text-white"
                                        : "text-slate-500 group-hover:text-slate-800"
                                }`}
                            />
                            <span>{label}</span>
                        </Button>
                    );
                })}
            </div>

            <div className="p-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-slate-600 border-slate-300 hover:bg-slate-100 hover:border-slate-400 rounded-xl"
                    onClick={onToggleSidebar}
                >
                    Ẩn sidebar
                </Button>
            </div>
        </aside>
    );
}
