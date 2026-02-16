"use client";

import { BookOpen, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

interface IntroductionPageProps {
    onNavigate: (page: "checklist" | "problems" | "ai-helper") => void;
}

export default function IntroductionPage({
    onNavigate,
}: IntroductionPageProps) {
    const features = [
        {
            icon: BookOpen,
            title: "Quản lý Bài Toán",
            description:
                "Duyệt và quản lý hàng ngàn bài toán từ các nền tảng khác nhau như Codeforces, LeetCode.",
        },
        {
            icon: CheckCircle2,
            title: "Checklist Cá Nhân",
            description:
                "Tạo danh sách bài toán cần giải, theo dõi tiến độ học tập của bạn.",
        },
        {
            icon: Zap,
            title: "AI Helper",
            description:
                "Hỏi AI và tìm kiếm trong cơ sở tri thức để giải quyết vấn đề nhanh chóng.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
            {/* Hero */}
            <section className="py-24 text-center px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent mb-6">
                        TwinLearn
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                        Nền tảng học lập trình cạnh tranh giúp bạn rèn luyện kỹ
                        năng giải quyết bài toán qua hàng ngàn đề chất lượng
                        cao.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            onClick={() => onNavigate("problems")}
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            Duyệt Bài Toán <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button
                            onClick={() => onNavigate("checklist")}
                            variant="outline"
                            size="lg"
                            className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 px-6 py-3 rounded-xl"
                        >
                            Tạo Checklist
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-14">
                        Tính Năng Chính
                    </h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {features.map(
                            ({ icon: Icon, title, description }, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 bg-slate-50 dark:bg-slate-800 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all"
                                >
                                    <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 flex items-center justify-center rounded-xl text-blue-600 dark:text-blue-300 mb-5">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        {title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-4">
                        Sẵn sàng bắt đầu?
                    </h2>
                    <p className="text-blue-100 mb-10">
                        Tham gia cùng hàng ngàn lập trình viên đang luyện tập
                        mỗi ngày để cải thiện kỹ năng của bạn.
                    </p>
                    <Button
                        onClick={() => onNavigate("problems")}
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto shadow-lg transition-all"
                    >
                        Khám Phá Ngay <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                © 2025 CodeWithCSTT. Phát triển bởi Đặng Nguyên, Vinh Khánh,
                Quốc Cường.
            </footer>
        </div>
    );
}
