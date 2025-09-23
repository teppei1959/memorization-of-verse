import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// ---- 型定義 ----
interface Verse {
  id: number;
  title: string;
  content: string;
}

// ---- 簡易 Button と Card コンポーネント ----
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400
                text-white font-bold px-6 py-3 rounded-lg shadow-lg
                hover:scale-105 transition-transform duration-200 ${className}`}
  >
    {children}
  </button>
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white border rounded-2xl shadow-xl p-6 ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`p-2 ${className}`}>{children}</div>
);

// ---- 聖句一覧画面（テーブル版） ----
interface VerseListProps {
  verses: Verse[];
}

const VerseList: React.FC<VerseListProps> = ({ verses }) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-50 via-yellow-50 to-green-50 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">聖句一覧</h1>

      <div className="w-full max-w-3xl overflow-x-auto">
        <table className="min-w-full border-collapse shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-pink-400 text-white text-left">
              <th className="px-6 py-3">タイトル</th>
              <th className="px-6 py-3">内容</th>
            </tr>
          </thead>
          <tbody>
            {verses.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center px-6 py-4 text-gray-700">
                  登録された聖句はありません。
                </td>
              </tr>
            ) : (
              verses.map((v, index) => (
                <tr
                  key={v.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-yellow-50"
                  } hover:bg-yellow-100 transition-colors`}
                >
                  <td className="px-6 py-4 font-semibold text-pink-500">{v.title}</td>
                  <td className="px-6 py-4 text-gray-700">{v.content}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-4">
        <Button onClick={() => navigate("/quiz")}>クイズ</Button>
        <Button onClick={() => navigate("/register")}>登録</Button>
      </div>
    </div>
  );
};

// ---- 聖句登録画面（縦並び・ラベル付き） ----
interface VerseRegisterProps {
  addVerse: (verse: Verse) => void;
}

const VerseRegister: React.FC<VerseRegisterProps> = ({ addVerse }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!title || !content) return;
    addVerse({ id: Date.now(), title, content });
    setTitle("");
    setContent("");
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-50 via-yellow-50 to-green-50 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">聖句登録</h1>

      <div className="w-full max-w-2xl space-y-4">
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-1 font-semibold text-gray-700">
            タイトル
          </label>
          <input
            id="title"
            type="text"
            placeholder="タイトルを入力"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="content" className="mb-1 font-semibold text-gray-700">
            内容
          </label>
          <textarea
            id="content"
            placeholder="内容を入力"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 h-32 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button onClick={handleSubmit}>登録</Button>
        <Button onClick={() => navigate("/")}>一覧に戻る</Button>
      </div>
    </div>
  );
};

// ---- クイズ画面 ----
interface VerseQuizProps {
  verses: Verse[];
}

const VerseQuiz: React.FC<VerseQuizProps> = ({ verses }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const navigate = useNavigate();

  const currentVerse = verses[currentIndex];
  const hasNextVerse = currentIndex + 1 < verses.length;

  const goToNextVerse = () => {
    setCurrentIndex(currentIndex + 1);
    setShowContent(false);
  };

  const endQuiz = () => {
    setCurrentIndex(0);
    setShowContent(false);
    navigate("/");
  };

  if (verses.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-50 via-yellow-50 to-green-50">
        <p className="text-xl text-gray-700 mb-4">登録された聖句がありません。</p>
        <Button onClick={() => navigate("/register")}>登録画面へ</Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-pink-50 via-yellow-50 to-green-50 p-4">
      <div className="w-full max-w-2xl p-8">
        <Card>
          <CardContent>
            <p className="text-2xl font-bold text-pink-500 text-center">{currentVerse.title}</p>
            {showContent && (
              <p className="mt-4 text-gray-700 text-lg text-center">{currentVerse.content}</p>
            )}
          </CardContent>
        </Card>
        <div className="mt-6 flex gap-4 justify-center">
          {!showContent ? (
            <Button onClick={() => setShowContent(true)}>回答</Button>
          ) : (
            <>
              {hasNextVerse ? (
                <Button onClick={goToNextVerse}>次へ</Button>
              ) : (
                <Button onClick={endQuiz}>終了</Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ---- App.tsx ルートコンポーネント ----
const App: React.FC = () => {
  const [verses, setVerses] = useState<Verse[]>([]);

  const addVerse = (verse: Verse) => {
    setVerses([...verses, verse]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<VerseList verses={verses} />} />
        <Route path="/register" element={<VerseRegister addVerse={addVerse} />} />
        <Route path="/quiz" element={<VerseQuiz verses={verses} />} />
      </Routes>
    </Router>
  );
};

export default App;

