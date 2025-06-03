import { useEffect, useState } from "react";
import api from "../api/axios";

const MoodList = ({ refresh, setRefresh }) => {
  const [entries, setEntries] = useState([]);
  const [openId, setOpenId] = useState(null); // 메모 토글용

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await api.get("mood/entries/list/");
        setEntries(res.data);
      } catch (err) {
        console.error("감정 목록 불러오기 실패:", err);
      }
    };
    fetchEntries();
  }, [refresh]);

  // 클릭한 항목이 열려있으면 닫고, 아니면 엶
  const toggleMemo = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">감정 목록</h1>
      <ul className="space-y-3">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="border border-gray-300 rounded-xl p-3 bg-white shadow hover:cursor-pointer"
            onClick={() => toggleMemo(entry.id)}
          >
            <div className="flex justify-between">
              <span className="font-semibold">{entry.emoticon}</span>
              <span className="text-sm text-gray-500">
                {entry.created_at.slice(0, 10)}
              </span>
            </div>
            {openId === entry.id && (
              <div className="mt-2 text-gray-700">{entry.memo}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoodList;
