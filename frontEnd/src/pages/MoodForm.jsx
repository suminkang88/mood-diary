import React, { useState } from "react";
import api from "../api/axios"; // axios 인스턴스 import

function MoodForm({ setRefresh }) {
  const [emoticon, setEmoticon] = useState("");
  const [memo, setMemo] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      //프론트에서 emoticon과 memo를 request에 담아서 서버로 보냄.
      const res = await api.post("mood/entries/", {
        emoticon,
        memo,
      });

      if (res.status === 201) {
        setMessage("오늘의 감정이 성공적으로 기록되었습니다.");
        setMemo("");
        setEmoticon("");
        setRefresh(true);
      } else {
        setMessage("감정 기록에 실패했습니다.");
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.error || "서버와의 연결에 실패했어요.";
      setMessage(errMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">오늘의 감정을 기록해보세요</h2>

      {/* 감정 선택 */}
      <div className="flex gap-3 mb-4">
        {[
          { value: "happy", label: "😊" },
          { value: "sad", label: "😢" },
          { value: "angry", label: "😡" },
          { value: "neutral", label: "😐" },
        ].map((emo) => (
          <button
            key={emo.value}
            onClick={() => setEmoticon(emo.value)}
            className={`text-3xl px-3 py-2 border rounded-lg ${
              emoticon === emo.value ? "bg-yellow-300" : "bg-gray-100"
            }`}
          >
            {emo.label}
          </button>
        ))}
      </div>

      {/* 메모 입력 */}
      <textarea
        placeholder="오늘 있었던 일을 적어보세요..."
        className="w-full p-2 border rounded-md mb-4 h-24"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
      />

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!emoticon}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        감정 기록하기
      </button>

      {/* 메시지 */}
      {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
    </div>
  );
}

export default MoodForm;
