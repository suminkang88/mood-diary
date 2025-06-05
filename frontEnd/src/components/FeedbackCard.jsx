// components/FeedbackCard.jsx
const FeedbackCard = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className="mt-6 p-4 bg-white border border-gray-300 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-2">📝 이번 주 감정 피드백</h2>
      <p className="text-gray-700 whitespace-pre-wrap">{feedback}</p>
    </div>
  );
};

export default FeedbackCard;
